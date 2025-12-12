import './App.css'
import { SubscribeForm } from './subscribe'
import * as DS from './contexts/DS'

function App() {
  const recentPosts = [
    { title: 'Post title coming soon', date: '2025' },
  ]

  return (
    <div className="container">
      <header>
        <h1>Morgante Pell</h1>
        <DS.Greeting name="Morgante" />
      </header>

      <section className="recent-posts">
        <h2>Recent posts</h2>
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
