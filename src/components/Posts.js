import React from "react";
import { Link } from "react-router";

import Notification from "./Notification";

export default class Posts extends React.Component {
  constructor() {
    super();

    this.state = {
      error: null,
      posts: [],
    };
  }

  componentWillMount() {
    const query = `
      query {
        posts {
          title
          slug
          lastUpdated
        }
      }
    `;

    const options = {
      method: "POST",
      body: JSON.stringify({ query }),
      headers: { "Content-Type": "application/json" },
    };

    fetch("/api", options)
      .then((response) => response.json())
      .then((response) => this.setState({
        error: null,
        posts: response.data.posts,
      }))
      .catch((error) => this.setState({ error }))
    ;
  }

  render() {
    const { error, posts } = this.state;

    if (!posts.length) {
      return (
        <div class="section">
          <div class="container">
            <i class="fa fa-cog fa-spin fa-3x fa-fw" />
          </div>
        </div>
      );
    }

    return (
      <section class="section">
        <div class="container">
          <Notification {...error} />

          {posts.map((post) => (
            <section class="section" key={post.slug}>
              <div class="heading">
                <h1 class="title">
                  <Link to={`/posts/${post.slug}`}>
                    {post.title}
                  </Link>
                </h1>

                <h2 class="subtitle">
                  {post.lastUpdated}
                </h2>
              </div>
            </section>
          ))}
        </div>
      </section>
    );
  }
}
