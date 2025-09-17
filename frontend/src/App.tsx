import Timer from './components/Timer'
// import ThemeToggle from './components/ThemeToggle'

function App() {
    return (
        <>
            <nav className="container py-4 flex justify-between">
                <div className='flex items-center gap-2'>
                    <div className="logo flex place-center">
                        <img src="/img/react.svg" alt="" />
                    </div>
                    <span className='text-2xl'>timetracker</span>
                </div>
                <Timer />
                {/* <ThemeToggle /> */}
            </nav>

            <section id="projects" className='container'>
                <span className="text-xl font-accent">projects</span>

                
            </section>
            
            <section id="time-entries" className='container'>
                <span className="text-xl font-accent">entries</span>
            </section>

            <section id="time-entries" className='container'>
                <span className="text-xl font-accent">history</span>
            </section>
        </>
    )
}

export default App
