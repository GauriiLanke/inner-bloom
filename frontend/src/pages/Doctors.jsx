import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import { LocateFixed, Sparkles, Stethoscope } from 'lucide-react'
import { useTranslation } from 'react-i18next'

function overpassQuery(lat, lon) {
  // Find doctors/clinics around the user (OpenStreetMap Overpass)
  return `
[out:json][timeout:25];
(
  node(around:5000,${lat},${lon})["amenity"="doctors"];
  node(around:5000,${lat},${lon})["amenity"="clinic"];
  node(around:5000,${lat},${lon})["healthcare"="doctor"];
  node(around:5000,${lat},${lon})["healthcare"="clinic"];
);
out center;
`
}

async function fetchDoctors(lat, lon) {
  const body = overpassQuery(lat, lon)
  const res = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body,
  })
  const json = await res.json()
  const elems = json?.elements || []
  return elems
    .map((e) => ({
      id: e.id,
      lat: e.lat || e.center?.lat,
      lon: e.lon || e.center?.lon,
      name: e.tags?.name || 'Clinic/Doctor',
      phone: e.tags?.phone || e.tags?.contact_phone || '',
      address:
        [e.tags?.['addr:housenumber'], e.tags?.['addr:street'], e.tags?.['addr:city']]
          .filter(Boolean)
          .join(' ') || e.tags?.['addr:full'] || '',
    }))
    .filter((x) => Number.isFinite(x.lat) && Number.isFinite(x.lon))
    .slice(0, 30)
}

export default function Doctors() {
  const [pos, setPos] = useState(null)
  const [loading, setLoading] = useState(false)
  const [doctors, setDoctors] = useState([])
  const { t } = useTranslation()

  const center = useMemo(() => pos || { lat: 19.076, lon: 72.8777 }, [pos]) // default: Mumbai

  const locate = async () => {
    setLoading(true)
    try {
      const p = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (x) => resolve({ lat: x.coords.latitude, lon: x.coords.longitude }),
          (e) => reject(e),
          { enableHighAccuracy: true, timeout: 10000 },
        )
      })
      setPos(p)
      const list = await fetchDoctors(p.lat, p.lon)
      setDoctors(list)
      toast.success(`${list.length} ${t('doctors.listTitle')}`)
    } catch {
      toast.error('Location not available. Allow location permissions and try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    locate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="bloom-bg min-h-[calc(100vh-88px)]">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/60 px-4 py-2 text-xs font-extrabold text-bloom-ink/70">
            <Sparkles className="h-4 w-4 text-bloom-purple" />
            {t('doctors.badge')}
          </div>
          <div className="mt-3 text-3xl font-black tracking-tight text-bloom-ink">
            {t('doctors.title').split(' ').slice(0, -1).join(' ')}{' '}
            <span className="text-bloom-purple">
              {t('doctors.title').split(' ').slice(-1)[0]}
            </span>
          </div>
          <div className="mt-2 text-sm font-semibold text-bloom-ink/70">
            {t('doctors.subtitle')}
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          <div className="bloom-card p-6 lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <div className="text-sm font-extrabold text-bloom-ink">{t('doctors.mapTitle')}</div>
              <button disabled={loading} onClick={locate} className="bloom-btn-primary px-4 py-2 text-sm">
                <LocateFixed className="h-4 w-4" />
                {loading ? t('doctors.locating') : t('doctors.useMyLocation')}
              </button>
            </div>

            <div className="h-[420px] overflow-hidden rounded-2xl border border-white/70">
              <MapContainer
                center={[center.lat, center.lon]}
                zoom={12}
                style={{ height: '420px', width: '100%' }}
                scrollWheelZoom
              >
                <TileLayer
                  attribution='&copy; OpenStreetMap contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {doctors.map((d) => (
                  <CircleMarker key={d.id} center={[d.lat, d.lon]} radius={8} pathOptions={{ color: '#7C3AED' }}>
                    <Popup>
                      <div style={{ fontFamily: 'system-ui' }}>
                        <div style={{ fontWeight: 800, marginBottom: 4 }}>{d.name}</div>
                        {d.address ? <div style={{ fontSize: 12 }}>{d.address}</div> : null}
                        {d.phone ? <div style={{ fontSize: 12, marginTop: 4 }}>{d.phone}</div> : null}
                      </div>
                    </Popup>
                  </CircleMarker>
                ))}
              </MapContainer>
            </div>
          </div>

          <div className="bloom-card p-6">
            <div className="flex items-center gap-2 text-sm font-extrabold text-bloom-ink">
              <Stethoscope className="h-5 w-5 text-bloom-purple" />
              {t('doctors.listTitle')}
            </div>
            <div className="mt-3 max-h-[440px] space-y-3 overflow-auto pr-1">
              {doctors.length ? (
                doctors.map((d) => (
                  <div key={d.id} className="rounded-2xl border border-white/70 bg-white/60 p-4">
                    <div className="text-sm font-extrabold text-bloom-ink">{d.name}</div>
                    <div className="mt-1 text-xs font-semibold text-bloom-ink/70">{d.address || '—'}</div>
                    <div className="mt-2 text-xs font-semibold text-bloom-ink/60">
                      {d.phone ? `☎ ${d.phone}` : ''}
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-white/70 bg-white/60 p-4 text-sm font-semibold text-bloom-ink/70">
                  {t('doctors.empty')}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

