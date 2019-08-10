import React, { Component } from "react";
import axios from "axios";

class Contact extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.submitContactForm = this.submitContactForm.bind(this);
    this.state = {
      name: "",
      subject: "",
      email: "",
      message: "",
      tweets: []
    };
    this.fetchTweets = this.fetchTweets.bind(this);
    this.fetchTweets();
  }

  async fetchTweets() {
    const response = await axios.get("/api/tweets");
    const savedTweets = [];
    const tweets = response.data.tweets.data;
    tweets.map(tweet => {
      savedTweets.push({
        text: tweet.text,
        date: tweet.created_at,
        link:
          tweet.entities.urls.length > 0
            ? tweet.entities.urls[0].expanded_url
            : "#"
      });
    });
    this.setState({ tweets: savedTweets });
  }

  handleChange(e) {
    switch (e.target.id) {
      case "contactName":
        this.setState({ name: e.target.value });
        break;
      case "contactEmail":
        this.setState({ email: e.target.value });
        break;
      case "contactSubject":
        this.setState({ subject: e.target.value });
        break;
      case "contactMessage":
        this.setState({ message: e.target.value });
        break;
    }
  }

  async submitContactForm() {
    const { name, email, subject, message } = this.state;
    const response = await axios.post("/api/sendmessage", {
      name,
      email,
      subject,
      message
    });
    console.log(response);
  }

  render() {
    if (this.props.data) {
      var name = this.props.data.name;
      var street = this.props.data.address.street;
      var city = this.props.data.address.city;
      var state = this.props.data.address.state;
      var zip = this.props.data.address.zip;
      var phone = this.props.data.phone;
      var email = this.props.data.email;
      var message = this.props.data.contactmessage;
    }

    return (
      <section id="contact">
        <div className="row section-head">
          <div className="two columns header-col">
            <h1>
              <span>Get In Touch.</span>
            </h1>
          </div>

          <div className="ten columns">
            <p className="lead">{message}</p>
          </div>
        </div>

        <div className="row">
          <div className="eight columns">
            <fieldset>
              <div>
                <label htmlFor="contactName">
                  Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  defaultValue=""
                  size="35"
                  id="contactName"
                  name="contactName"
                  onChange={this.handleChange}
                />
              </div>

              <div>
                <label htmlFor="contactEmail">
                  Email <span className="required">*</span>
                </label>
                <input
                  type="text"
                  defaultValue=""
                  size="35"
                  id="contactEmail"
                  name="contactEmail"
                  onChange={this.handleChange}
                />
                />
              </div>

              <div>
                <label htmlFor="contactSubject">Subject</label>
                <input
                  type="text"
                  defaultValue=""
                  size="35"
                  id="contactSubject"
                  name="contactSubject"
                  onChange={this.handleChange}
                />
                />
              </div>

              <div>
                <label htmlFor="contactMessage">
                  Message <span className="required">*</span>
                </label>
                <textarea
                  cols="50"
                  rows="15"
                  id="contactMessage"
                  name="contactMessage"
                  onChange={this.handleChange}
                />
              </div>

              <div>
                <button
                  className="submit"
                  onClick={e => this.submitContactForm()}
                >
                  Submit
                </button>
                <span id="image-loader">
                  <img alt="" src="images/loader.gif" />
                </span>
              </div>
            </fieldset>

            <div id="message-warning"> Error boy</div>
            <div id="message-success">
              <i className="fa fa-check" />
              Your message was sent, thank you!
              <br />
            </div>
          </div>

          <aside className="four columns footer-widgets">
            <div className="widget widget_contact">
              <h4>Address and Phone</h4>
              <p className="address">
                {name}
                <br />
                {street} <br />
                {city}, {state} {zip}
                <br />
                <span>{phone}</span>
              </p>
            </div>

            <div className="widget widget_tweets">
              <h4 className="widget-title">Latest Tweets</h4>
              <ul id="twitter">{this.state ? this.renderTweets() : <div />}</ul>
            </div>
          </aside>
        </div>
      </section>
    );
  }

  renderTweets() {
    var items = [];
    this.state.tweets.map(tweet => {
      items.push(
        <li key={tweet.date}>
          <span>{tweet.text}</span>
          <b>
            <a href={tweet.link}>{this.parseTwitterDate(tweet.date)}</a>
          </b>
        </li>
      );
    });

    return items;
  }

  parseTwitterDate(tdate) {
    var systemDate = new Date(Date.parse(tdate));
    var userDate = new Date();
    var diff = Math.floor((userDate - systemDate) / 1000);
    if (diff <= 1) {
      return "just now";
    }
    if (diff < 20) {
      return diff + " seconds ago";
    }
    if (diff < 40) {
      return "half a minute ago";
    }
    if (diff < 60) {
      return "less than a minute ago";
    }
    if (diff <= 90) {
      return "one minute ago";
    }
    if (diff <= 3540) {
      return Math.round(diff / 60) + " minutes ago";
    }
    if (diff <= 5400) {
      return "1 hour ago";
    }
    if (diff <= 86400) {
      return Math.round(diff / 3600) + " hours ago";
    }
    if (diff <= 129600) {
      return "1 day ago";
    }
    if (diff < 604800) {
      return Math.round(diff / 86400) + " days ago";
    }
    if (diff <= 777600) {
      return "1 week ago";
    }
    return "on " + systemDate;
  }
}

export default Contact;
