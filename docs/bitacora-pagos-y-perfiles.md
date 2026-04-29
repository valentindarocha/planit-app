# Bitácora — Sistema de pagos y perfiles

Resumen de las dos jornadas de trabajo sobre integración de Mercado Pago,
sistema de avatares, panel de proveedor y panel de organizador.

---

## Día 1 — Integración inicial

### 1. Reescritura de `PanelProveedorPage` con datos reales

Antes el panel mostraba "DJ Matías López" hardcodeado. Cambios:

- `fetchData` que carga el perfil del proveedor logueado desde `Profiles`
  y sus reservas desde `reservas`.
- `handleAceptar` / `handleRechazar` ahora hacen `UPDATE` real sobre
  `reservas.estado` (`pendiente` → `confirmada` / `rechazada`).
- Estados nuevos: `profileData`, `dbLoading`.
- Pantalla de carga mientras se traen los datos.

### 2. Sistema de avatares (`AvatarUpload`)

Componente reutilizable en `app/components/AvatarUpload.tsx`:

- Validación de tipo (`image/*`) y tamaño (max 5 MB).
- Sube a `Storage → avatars/{userId}/avatar.{ext}` con `upsert: true`.
- Genera URL pública con cache-buster (`?t=timestamp`).
- Actualiza `Profiles.foto_perfil` con la URL limpia.
- Sincroniza la nueva URL con `AuthContext.updateAvatarUrl()` para que el
  Navbar la vea en tiempo real.

Integrado en:

- `panel-proveedor → SeccionPerfil` (size 72)
- `panel-organizador → SeccionPerfil` (size 72)
- `Navbar` (size 32, vía `NavAvatar` que muestra placeholder de inicial
  si no hay foto)

### 3. Mercado Pago — Checkout Pro

Flujo end-to-end de pago de seña:

- **Modal de reserva** (`PerfilClient.tsx`) ampliado de 3 a 4 pasos.
  El paso 4 es la pantalla de pago con CTA "Pagar seña · $X".
- **Route handler** `app/api/pagos/crear-preferencia/route.ts`:
  - Recibe `{ proveedor_nombre, servicio, fecha_evento, monto_sena, reserva_id }`.
  - Crea preferencia con MP SDK v2 (`MercadoPagoConfig`, `Preference`).
  - `back_urls` apuntan a `/reserva/exito`, `/reserva/error`, `/reserva/pendiente`.
  - Devuelve `init_point` para redirigir al checkout.
- **Páginas de retorno** `/reserva/exito` y `/reserva/error`, ambas con
  `useSearchParams()` envuelto en `Suspense`.
  - `/reserva/exito` actualiza `estado = "confirmada"` solo si
    `collection_status === "approved"`.
- **`MP_ACCESS_TOKEN`** y **`NEXT_PUBLIC_MP_PUBLIC_KEY`** en `.env.local`.

### 4. Bugs encontrados y resueltos

| Síntoma | Causa | Fix |
|---|---|---|
| `invalid input syntax for type uuid: "dj-matias-lopez"` al reservar a un proveedor mock | Los mocks usan slug-IDs, la columna `proveedor_id` es UUID | Helper `uuidOrNull(id)` + `ALTER TABLE reservas ALTER COLUMN proveedor_id DROP NOT NULL` |
| `new row violates row-level security policy for table "reservas"` | RLS habilitado sin políticas de INSERT/SELECT/UPDATE | SQL de creación de las 3 policies |
| `supabaseKey is required` durante `next build` | `supabaseAdmin` se instanciaba en module scope con `SUPABASE_SERVICE_ROLE_KEY` vacío | Singleton lazy en `app/lib/supabase-admin.ts` + `export const dynamic = "force-dynamic"` en el route handler |
| Pago llegaba a la cuenta de PLANIT, no del proveedor | Endpoint usaba siempre `MP_ACCESS_TOKEN` global | Agregadas columnas `mp_access_token`/`mp_public_key` en `Profiles` y route handler con fallback chain (token del proveedor → token de PLANIT) |

---

## Día 2 — Simplificación y bugs estructurales

### 1. Simplificación de Mercado Pago: alias en lugar de tokens

A pedido del usuario, los proveedores ya no cargan Access Token + Public Key
(técnico) sino solo su **alias de MP** (humano).

- Campo único `mp_alias` agregado a:
  - Formulario de **registro** (`app/cuenta/page.tsx`) — solo si rol = proveedor.
  - **Panel de proveedor → Mi perfil → sección Mercado Pago**.
- El alias **no es visible** para los organizadores. Solo lo ve el equipo
  de PLANIT internamente para hacer la transferencia manual.
- El pago en sí sigue yendo a la cuenta de PLANIT vía `MP_ACCESS_TOKEN`.

### 2. Cadena larga de bugs en el guardado de perfil

Esta fue la parte más complicada del día. La cadena de causas y arreglos:

#### Bug A — "No aparece la sección Mercado Pago"

- **Causa**: el `SELECT` incluía columnas que no existían (`mp_access_token`,
  `mp_public_key`). PostgREST devuelve error y `data` queda `null`, así que
  toda `SeccionPerfil` no renderizaba.
- **Fix**: separar el fetch de columnas opcionales en queries propias.

#### Bug B — Email en lugar del nombre + "Mi perfil" en blanco

- **Causa**: si el usuario no tiene fila en `Profiles` (por ejemplo, registro
  con confirmación de email), `profile === null`, `perfilData` no se setea,
  y el render hace fallback al `user.email` (con `??` que solo cubre `null/undefined`).
- **Fix**: `setPerfilData` siempre (con valores vacíos por defecto) +
  cambiar `??` a `||` en el `nombreMostrar`.

#### Bug C — Crash al cerrar sesión

- **Síntoma**: `Cannot read properties of null (reading 'id')` en `userId={user!.id}`.
- **Causa**: tras `signOut`, `user` queda `null` un frame antes de que el
  `useEffect` redirija. La aserción `user!` no previene el error en runtime.
- **Fix**: `if (!user) return null;` después del check de loading.

#### Bug D — "Error al guardar" verde (parecía éxito)

- **Causa**: el componente `Toast` recibía `tipo="exito"` hardcodeado.
- **Fix**: el state `toast` ahora incluye `{ mensaje, tipo }` y la función
  `onToast(msg, tipo)` viaja por todos los call-sites.

#### Bug E — Los datos se borraban al cerrar y volver a iniciar sesión

- **Causa raíz**: las columnas `descripcion`, `ubicacion`, `telefono`, `mp_alias`
  **no existían** en `Profiles`. Al meterlas en el mismo `UPDATE` que columnas
  válidas, PostgREST rechazaba todo el query. Como el código ignoraba el error
  en silencio, parecía que se guardaba pero nada llegaba a la BD.
- **Fix**: cada columna opcional va en su propio `UPDATE`. Si falla una, las
  demás siguen funcionando. Mismo principio para los `SELECT` de carga.

#### Bug F — Después de guardar, los datos volvían a los anteriores al cambiar de tab

- **Causa**: el state local de `SeccionPerfil` (`useState(initialPerfil)`)
  solo se inicializa una vez. Al cambiar a "Resumen" y volver a "Mi perfil",
  el componente se desmonta/remonta con `initialPerfil` viejo (el padre
  nunca se enteró del save).
- **Fix**: callback `onPerfilGuardado(perfil)` (y `onDatosGuardados` en
  organizador) que sincroniza el state del padre tras un save exitoso.

#### Bug G — Warnings de React

- `An empty string ("") was passed to the src attribute`: el `<img>` de
  `FotoPerfilEditable` se renderizaba aunque `foto === ""`.
  **Fix**: render condicional con placeholder de inicial.
- `A component is changing an uncontrolled input to be controlled`:
  inputs con `value={undefined}` que después se llenaban.
  **Fix**: `value={x ?? ""}` en todos los inputs.

#### Bug H — Bucket de Storage "not found"

- **Causa**: el bucket en Supabase se llamaba `AVATARS` (mayúsculas),
  el código buscaba `avatars` (minúsculas). Los nombres de bucket son
  case-sensitive.
- **Fix**: borrar el bucket y recrearlo con el nombre exacto `avatars`.
  Las policies de `storage.objects` ya estaban (apuntan a `bucket_id = 'avatars'`).

#### Bug I — Falta de policy SELECT en Storage

- **Causa**: el bucket nuevo tenía INSERT y UPDATE pero no SELECT, así
  que las URLs públicas no devolvían contenido.
- **Fix**: `CREATE POLICY "avatars_public_read" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');`

---

## Estado final del esquema

### Tabla `Profiles`

```sql
ALTER TABLE "Profiles" ADD COLUMN IF NOT EXISTS descripcion      TEXT;
ALTER TABLE "Profiles" ADD COLUMN IF NOT EXISTS ubicacion        TEXT;
ALTER TABLE "Profiles" ADD COLUMN IF NOT EXISTS telefono         TEXT;
ALTER TABLE "Profiles" ADD COLUMN IF NOT EXISTS mp_alias         TEXT;
ALTER TABLE "Profiles" ADD COLUMN IF NOT EXISTS mp_access_token  TEXT;
ALTER TABLE "Profiles" ADD COLUMN IF NOT EXISTS mp_public_key    TEXT;
```

(Las dos últimas quedan reservadas por si el día de mañana se hace cobro
directo al proveedor con OAuth de MP. Hoy no se usan.)

### Tabla `reservas`

- Columna `proveedor_id` es nullable (para soportar mocks con slug-IDs).
- RLS habilitado con 3 policies: SELECT, INSERT, UPDATE.

### Storage

- Bucket `avatars` (todo en minúsculas, público).
- 3 policies sobre `storage.objects`:
  - `avatars_public_read` → SELECT
  - `avatars_user_upload` → INSERT (solo authenticated)
  - `avatars_user_update` → UPDATE (solo authenticated)

### Variables de entorno

| Variable | Dónde |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `.env.local` + Vercel |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `.env.local` + Vercel |
| `SUPABASE_SERVICE_ROLE_KEY` | `.env.local` + Vercel (Settings → API → service_role) |
| `MP_ACCESS_TOKEN` | `.env.local` + Vercel |
| `NEXT_PUBLIC_MP_PUBLIC_KEY` | `.env.local` + Vercel |

---

## Archivos creados o modificados

### Creados
- `app/api/pagos/crear-preferencia/route.ts`
- `app/lib/supabase-admin.ts`
- `app/components/AvatarUpload.tsx`
- `app/reserva/exito/page.tsx`
- `app/reserva/error/page.tsx`

### Modificados
- `app/cuenta/page.tsx` (registro con alias MP)
- `app/panel-proveedor/page.tsx` (perfil real, MP, fix guardado)
- `app/panel-organizador/page.tsx` (perfil real, fix guardado)
- `app/proveedores/[id]/PerfilClient.tsx` (modal de 4 pasos)
- `app/contexts/AuthContext.tsx` (avatarUrl + updateAvatarUrl)
- `app/components/Navbar.tsx` (NavAvatar)
- `.env.local` (variables MP + service role)

---

## Lecciones para próximas migraciones

1. **Nunca meter una columna nueva en el mismo `UPDATE` o `SELECT` que las
   columnas existentes.** Si la nueva no existe, todo el query falla y
   parece que se rompió otra cosa. Cada columna opcional va en su propio
   query, con manejo de error silencioso.

2. **Toast con `tipo="exito"` hardcodeado oculta los errores reales.**
   El tipo debe viajar junto con el mensaje desde el origen.

3. **`useState(initialProp)` solo se inicializa una vez.** Si el padre
   guarda cambios sin sincronizar el state del hijo, al desmontar/remontar
   se ven los valores viejos. Solución: callback de sincronización.

4. **`??` cubre `null/undefined`, no string vacío.** Para fallback al email
   cuando el nombre puede ser `""`, usar `||`.

5. **Los nombres de bucket en Supabase Storage son case-sensitive.**
   El código y el bucket deben coincidir exactamente.

6. **`useState(initialPerfil)` + `if (profile)` para condicionar el render
   produce un panel en blanco cuando no hay fila.** Mejor: setear siempre
   con valores por defecto, manejar el caso "no hay fila" en el guardado
   (con INSERT fallback si hace falta).
