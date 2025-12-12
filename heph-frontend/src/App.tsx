import './App.css'
import { Wrapper } from './design/wrapper'
import { SubscribeForm } from './subscribe'

function App() {
  return (
    <div className="container">
      <header>
        <h1>Morgante Pell</h1>
      </header>

      <section className="recent-posts">
        <h2>Recent posts</h2>
        <Wrapper />
        <div className="posts-list">
          {recentPosts.map((post, index) => (
            <div key={index} className="post-item">
              <span className="post-date">{post.date}</span>
              <span className="post-title">{post.title}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="subscribe-section">
        <h2>Subscribe</h2>
        <SubscribeForm />
      </section>
    </div>
  )
}

export default App
