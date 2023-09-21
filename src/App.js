import { useState, useEffect} from "react"

const App = () => {
    const [ value, setValue] = useState(null)
    const [ message, setMessage] = useState(null)
    const [ previousStories, setPreviousStories] = useState([])
    const [ currentTitle, setCurrentTitle] = useState(null)

    const createNewStory = () => {
        setMessage(null)
        setValue("")
        setCurrentTitle(null)
    }

    const handleClick = (uniqueTitles) => {
      setCurrentTitle(uniqueTitles)
      setMessage(null)
      setValue("")
    }
    const getMessages = async () => {
        const options = {
            method: "POST",
            body : JSON.stringify({
                message: value
            }),
            headers: {
                "Content-Type": "application/json"
            }
        }
        try {
            const response = await fetch('http://localhost:8000/completions', options)
            const data = await response.json()
            setMessage(data.choices[0].message)
        } catch (error) {
            console.log(error)
        }
    }
   useEffect(() => {
    console.log(currentTitle, value, message)
    if(!currentTitle && value && message) {
        setCurrentTitle(value)
    }
    if(currentTitle && value && message) {
        setPreviousStories(previousStories => (
            [...previousStories,
                {
                    title:currentTitle,
                    role:"user",
                    content:value
                },
                {
                    title: currentTitle,
                    role: message.role,
                    content: message.content
                }
            ]
        ))
    }
   } ,[message, currentTitle])

   const currentStory = previousStories.filter(previousStories => previousStories.title === currentTitle)
   const uniqueTitles = Array.from (new Set(previousStories.map(previousStories => previousStories.title)))

  return (
      <div className="app">
        <section className="side-bar">
          <button onClick={createNewStory}>+ New Story</button>
          <ul className="history">
              {uniqueTitles?.map((uniqueTitles, index) => <li key={index} onClick={handleClick}>{uniqueTitles}</li>)}
          </ul>
          <nav>
            <p>#</p>
          </nav>
        </section>
        <section className="main">
          <h1>AI Story Generator</h1>
          <ul className="feed">
              {currentStory?.map((chatMessage, index) => <li key={index}>
                  <p className="role">{chatMessage.role}</p>
                  <p>{chatMessage.content}</p>
              </li> )}
          </ul>
          <div className="bottom-section">
            <div className="input-container">
              <input value={value} onChange={(e)=> setValue(e.target.value)}/>
              <div id="submit" onClick={getMessages}>&#x27A2;</div>
            </div>
            <p className="info">Start your prompt with "Generate a story"</p>
          </div>
        </section>
      </div>
  );
}

export default App;