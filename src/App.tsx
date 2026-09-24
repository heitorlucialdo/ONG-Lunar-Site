import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { StoreProvider } from '@/services/store'
import { ToastProvider } from '@/components/ui/Toast'
import { PetFormProvider } from '@/components/pets/PetFormProvider'
import { AppShell } from '@/components/layout/AppShell'
import { ButtonLink } from '@/components/ui/Button'
import { LunarGlyph } from '@/components/brand/LunarMark'
import { Dashboard } from '@/pages/Dashboard'
import { Pets } from '@/pages/Pets'
import { PetProfile } from '@/pages/PetProfile'
import { Logistics } from '@/pages/Logistics'
import { Prontuarios } from '@/pages/Prontuarios'
import { Medications } from '@/pages/Medications'
import { Vaccines } from '@/pages/Vaccines'
import { Agenda } from '@/pages/Agenda'
import { Tasks } from '@/pages/Tasks'
import { Tutores } from '@/pages/Tutores'
import { Reports } from '@/pages/Reports'
import { Alerts } from '@/pages/Alerts'
import { Settings } from '@/pages/Settings'

function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <LunarGlyph className="h-14 w-14" />
      <h1 className="mt-5 font-display text-2xl font-extrabold text-ink">Página não encontrada</h1>
      <p className="mt-1.5 max-w-sm text-muted">O endereço acessado não existe ou foi movido.</p>
      <ButtonLink to="/" className="mt-6">Voltar ao início</ButtonLink>
    </div>
  )
}

export default function App() {
  return (
    <StoreProvider>
      <ToastProvider>
        <BrowserRouter>
          <PetFormProvider>
            <Routes>
              <Route element={<AppShell />}>
                <Route index element={<Dashboard />} />
                <Route path="pets" element={<Pets />} />
                <Route path="pets/:id" element={<PetProfile />} />
                <Route path="prontuarios" element={<Prontuarios />} />
                <Route path="logistica" element={<Logistics />} />
                <Route path="agenda" element={<Agenda />} />
                <Route path="medicamentos" element={<Medications />} />
                <Route path="vacinas" element={<Vaccines />} />
                <Route path="tarefas" element={<Tasks />} />
                <Route path="tutores" element={<Tutores />} />
                <Route path="relatorios" element={<Reports />} />
                <Route path="alertas" element={<Alerts />} />
                <Route path="configuracoes" element={<Settings />} />
                <Route path="404" element={<NotFound />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
              </Route>
            </Routes>
          </PetFormProvider>
        </BrowserRouter>
      </ToastProvider>
    </StoreProvider>
  )
}
