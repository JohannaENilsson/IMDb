import React from "react";
import { Helmet } from "react-helmet";
import { Redirect } from "react-router-dom";
import axios from "axios";

class Edit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      title: "",
      description: "",
      director: "",
      rating: 0,
      redirect: 0
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handelRedirect = this.handelRedirect.bind(this);
  }

  componentDidMount() {
    let id = this.props.match.params.id;
    axios
      .get("http://3.120.96.16:3001/movies/" + id)
      .then(res => {
        let data = res.data;

        if (data) {
          this.setState({
            id: data.id,
            title: data.title,
            description: data.description,
            director: data.director,
            rating: data.rating
          });
        }
      })
      .catch(err => {
        console.log("Err", err);
        this.setState({ redirect: 4 });
        this.handelRedirect();
      });
  }

  handleInputChange(e) {
    const target = e.target;
    const name = target.name;
    this.setState({ [name]: e.target.value });
  }
  handelRedirect() {
    setTimeout(() => {
      this.setState({ redirect: 2 });
    }, 2500);
  }
  handleReset(e) {
    e.preventDefault();
    this.setState({
      title: "",
      description: "",
      director: "",
      rating: "",
      redirect: 0
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const movie = {
      title: this.state.title,
      description: this.state.description,
      director: this.state.director,
      rating: this.state.rating
    };
    if (
      movie.title.trim().length !== 0 &&
      movie.description.trim().length !== 0 &&
      movie.director.trim().length !== 0
    ) {
      axios
        .put("http://3.120.96.16:3001/movies/" + this.state.id, movie)
        .then(res => {
          console.log(res.data);
          this.setState({ redirect: 1 });
          this.handelRedirect();
        })
        .catch(err => {
          console.log("Err", err);
          this.setState({ redirect: 4 });
          this.handelRedirect();
        });
    }
  }

  onKeyPress = e => {
    if (e.keyCode === 13) {
      e.preventDefault();
      this.handleSubmit(e);
    }
  };

  render() {
    let editMovie;
    let redirect;
    let error;
    if (this.state.redirect === 1) {
      redirect = (
        <div className="success">
          Your change was successful. You will be redirected to the main paige
        </div>
      );
    } else if (this.state.redirect === 4) {
      error = (
        <div className="error">
          Sorry, no change was made. You will be redirected to the main paige
        </div>
      );
    } else if (this.state.redirect === 2) {
      return <Redirect to="/" />;
    } else {
      editMovie = (
        <div>
    <h2>Edit</h2>
          <form onSubmit={this.handleSubmit} onKeyPress={this.onKeyPress}>
            <label>Title: </label>
            <input
              onChange={this.handleInputChange}
              type="text"
              name="title"
              value={this.state.title}
              required
              minLength="1"
              maxLength="40"
            ></input>

            <label>Director: </label>
            <input
              onChange={this.handleInputChange}
              type="text"
              name="director"
              value={this.state.director}
              required
              minLength="1"
              maxLength="40"
            ></input>

            <label>Description: </label>
            <textarea
              onChange={this.handleInputChange}
              type="text"
              name="description"
              value={this.state.description}
              required
              minLength="1"
              maxLength="300"
            ></textarea>

            <label>Rating: </label>
            <input
              onChange={this.handleInputChange}
              type="number"
              name="rating"
              value={this.state.rating}
              required
              min="0"
              max="5"
              step="0.1"
            ></input>

            <button>Save update</button>
            <button onClick={this.handleReset}>Reset</button>
          </form>
        </div>
      );
    }

    return (
      <>
        <Helmet>
          <title>{this.state.title}</title>
        </Helmet>
        <div className="form container">
          {redirect}
          {error}
          {editMovie}
        </div>
      </>
    );
  }
}

export default Edit;
