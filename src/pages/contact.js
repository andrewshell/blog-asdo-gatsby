import React from 'react'
import { navigate } from 'gatsby-link'
import Layout from "../components/layout";

function encode(data) {
  return Object.keys(data)
    .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
    .join('&')
}

export default function Contact() {
  const [state, setState] = React.useState({})

  const handleChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const form = e.target
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: encode({
        'form-name': form.getAttribute('name'),
        ...state,
      }),
    })
      .then(() => navigate(form.getAttribute('action')))
      .catch((error) => alert(error))
  }

  return (
    <Layout>
      <h1>Contact</h1>

      <p>I love hearing from people, so please contact me and introduce yourself.</p>

      <p>Why?</p>

      <ol>
        <li>If you found my website we probably have something in common and I'd love to learn more about you.</li>
        <li>I enjoy brainstorming with people about their ideas. So let me know what you're working on!</li>
      </ol>

      <form
        name="contact"
        method="post"
        action="/thank-you/"
        data-netlify="true"
        data-netlify-honeypot="bot-field"
        onSubmit={ handleSubmit }
      >
        {/* The `form-name` hidden field is required to support form submissions without JavaScript */}
        <input type="hidden" name="form-name" value="contact" />
        <div className="hidden">
          <label>
            Don’t fill this out: <input name="bot-field" onChange={ handleChange } />
          </label>
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="name"
          >
            Your Name
          </label>
          <input
            className="rounded-lg w-full py-2 px-3 border text-gray-800 border-gray-500 bg-white"
            type="text"
            name="name"
            id="name"
            onChange={ handleChange }
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Your Email
          </label>
          <input
            className="rounded-lg w-full py-2 px-3 border text-gray-800 border-gray-500 bg-white"
            type="email"
            name="email"
            id="email"
            onChange={ handleChange }
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="subject"
          >
            Subject
          </label>
          <input
            className="rounded-lg w-full py-2 px-3 border text-gray-800 border-gray-500 bg-white"
            type="subject"
            name="subject"
            id="subject"
            onChange={ handleChange }
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="message"
          >
            Message
          </label>
          <textarea
            className="rounded-lg w-full py-2 px-3 border text-gray-800 border-gray-500 bg-white"
            name="message"
            id="message"
            onChange={ handleChange }
          />
        </div>
        <div>
          <button
            className="bg-green-700 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Send
          </button>
        </div>
      </form>
    </Layout>
  )
}
