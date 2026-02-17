import '../../globals.css'

export default function PublicPageLayout({ children }) {
  return (
    <main className={'bg-blue-50 min-h-screen font-sans'}>
      {children}
    </main>
  )
}
