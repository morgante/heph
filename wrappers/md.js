import React from 'react'
import 'css/markdown-styles.css'
import DocumentTitle from 'react-document-title'
import { config } from 'config'

module.exports = React.createClass({
  propTypes () {
    return {
      router: React.PropTypes.object,
    }
  },
  render () {
    const post = this.props.route.page.data;
    return (
      <DocumentTitle title={`${config.siteTitle} | ${post.title}`}>
        <div className="markdown">
          <h3>{post.title}</h3>
          { post.bob && (<h3>Bob: {post.bob}</h3>)}
          <div dangerouslySetInnerHTML={{ __html: post.body }} />
        </div>
      </DocumentTitle>
    )
  },
})
