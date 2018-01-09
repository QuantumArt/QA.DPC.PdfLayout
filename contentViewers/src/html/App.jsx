import React, { Component } from 'react';
import axios from 'axios';
import 'bulma/css/bulma.css';
import Spinner from '../shared/Spinner';
import ErrorMessage from '../shared/ErrorMessage';
import api from '../shared/api';
import '../shared/reset.css';

class App extends Component {
  state = {
    loaded: false,
    error: false,
    errorMsg: '',
    data: '',
  };

  componentWillMount() {
    const url = api().html;

    axios
      .get(url, { responseType: 'blob' })
      .then((res) => {
        const { status } = res;

        if (status === 200) {
          const type = res.headers['content-type'];
          const reader = new FileReader();

          if (type === 'application/json; charset=utf-8') {
            reader.readAsText(res.data, 'UTF-8');
            reader.onload = () => {
              const jsonRes = JSON.parse(reader.result);
              this.setState({
                loaded: true,
                error: true,
                errorMsg: jsonRes.error,
              });
            };
          } else {
            reader.readAsDataURL(res.data);
            reader.onload = () => {
              this.setState({
                loaded: true,
                data: reader.result,
              });
            };
          }
        } else {
          const { error } = res.data;

          this.setState({
            loaded: true,
            error: true,
            errorMsg: error,
          });
        }
      })
      .catch((e) => {
        this.setState({
          loaded: true,
          error: true,
          errorMsg: e.message,
        });
      });
  }

  render() {
    const {
      loaded,
      error,
      errorMsg,
      data,
    } = this.state;

    if (!loaded) {
      return <Spinner />;
    }
    if (error) {
      return <ErrorMessage msg={errorMsg} />;
    }

    return (
      <object
        title="generated html"
        type="text/html"
        data={data}
        width={`${window.innerWidth} px`}
        height={`${window.innerHeight} px`}
      />
    );
  }
}

export default App;
