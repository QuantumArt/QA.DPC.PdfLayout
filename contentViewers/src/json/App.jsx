import React, { Component } from 'react';
import axios from 'axios';
import Dropdown from 'react-dropdown';
import JSONTree from 'react-json-tree';
import { createStyling, invertTheme } from 'react-base16-styling';
import 'bulma/css/bulma.css';
import 'react-dropdown/style.css';

import api from '../shared/api';
import themes from './themes';
import loadingIcon from '../shared/loadingIcon.svg';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      loaded: false,
      error: false,
      errorMsg: '',
      rawData: '',
      data: {},
      showRaw: false,
      wordWrap: true,
      theme: themes.material,
      inverted: true,
      showType: true,
    };

    this.themesNames = Object.keys(themes);
  }

  componentWillMount() {
    const url = api().getMappingUrl();

    axios
      .get(url)
      .then((res) => {
        const { success, error, jsonString } = res.data;

        if (success) {
          const data = JSON.parse(jsonString);
          this.setState({
            loaded: true,
            rawData: JSON.stringify(data, null, 2),
            data,
          });
        } else {
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

  setTheme = ({ label }) => {
    this.setState({
      theme: themes[label],
    });
  }

  getItemString = (type, data, itemType, itemString) => {
    const { showType } = this.state;
    if (showType) {
      return (
        <span>{itemType} {itemString}</span>
      );
    }
    return (
      <span>{type} with {itemString}</span>
    );
  }

  toggleType = () => {
    this.setState({ showType: !this.state.showType });
  }

  toggleRaw = () => {
    this.setState({ showRaw: !this.state.showRaw });
  }

  togleWordWrap = () => {
    this.setState({ wordWrap: !this.state.wordWrap });
  }

  invert = () => {
    this.setState({ inverted: !this.state.inverted });
  }

  render() {
    const {
      loaded,
      error,
      errorMsg,
      rawData,
      showRaw,
      wordWrap,
      data,
      theme,
      inverted,
    } = this.state;

    const getTheme = () => {
      if (inverted) {
        return invertTheme(theme);
      }
      return theme;
    };

    const styling = createStyling(base16Theme => ({
      pre: {
        backgroundColor: base16Theme.base00,
        color: base16Theme.base0B,
      },
    }), {}, getTheme());

    if (!loaded) {
      return (
        <img className="loading" src={loadingIcon} alt="Loading..." />
      );
    }
    if (error) {
      return (
        <h1
          className="error has-text-centered has-text-danger is-size-4 has-text-weight-semibold"
        >
          {errorMsg}
        </h1>
      );
    }

    return (
      <div className="container has-text-centered main">
        <nav className="navbar">
          <Dropdown
            className="theme-options"
            options={this.themesNames}
            onChange={this.setTheme}
            placeholder={theme.scheme}
          />
          <button className="button invert-button" onClick={this.invert}>
            Invert
          </button>
          {!showRaw &&
            <button className="button" onClick={this.toggleType}>
              Toggle types
            </button>
          }
          <button className="button is-info" onClick={this.toggleRaw}>
            {showRaw ? 'Show formatted' : 'Show raw'}
          </button>
          {showRaw &&
            <button
              className={wordWrap ? 'button is-success' : 'button'}
              onClick={this.togleWordWrap}
            >
              {wordWrap ? 'Word wrap is on' : 'Word wrap is off'}
            </button>
          }
        </nav>
        {showRaw ? (
          <pre
            className={wordWrap ? 'raw raw-word-wrap' : 'raw'}
            {...styling('pre')}
          >
            {rawData}
          </pre>
        ) : (
          <div className="json-viewer">
            <JSONTree
              data={data}
              invertTheme={inverted}
              getItemString={this.getItemString}
              theme={{
                extend: theme,
                tree: {
                  paddingLeft: 20,
                  paddingRight: 20,
                  paddingTop: 30,
                  paddingBottom: 40,
                  marginLeft: 0,
                  marginTop: 0,
                  marginBottom: 0,
                  borderRadius: 4,
                },
              }}
            />
          </div>
        )}
      </div>
    );
  }
}

export default App;
