import '../globals.css'

export default function WebsiteLayout({children}) {
  return (
    <main className={'bg-white min-h-screen font-sans'}>
      {children}
    </main>
  )
}
