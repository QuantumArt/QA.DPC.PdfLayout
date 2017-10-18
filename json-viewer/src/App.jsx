import React, { Component } from 'react';
import axios from 'axios';
import Dropdown from 'react-dropdown';
import JSONTree from 'react-json-tree';
import { createStyling } from 'react-base16-styling';
import 'bulma/css/bulma.css';
import 'react-dropdown/style.css';

import themes from './themes';
import loadingIcon from './loadingIcon.svg';
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
      theme: themes.monokai,
      invertTheme: false,
      showType: true,
    };

    this.themesNames = Object.keys(themes);
  }

  componentWillMount() {
    const url = 'http://mscservices01:17001/api/productJsonMapper/1713794?category=test';
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
    this.setState({ invertTheme: !this.state.invertTheme });
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
      invertTheme,
    } = this.state;

    const styling = createStyling(() => ({
      pre: {
        backgroundColor: theme.base00,
        color: theme.base0B,
      },
    }), {}, theme);

    if (!loaded) {
      return (
        <img className="loading" src={loadingIcon} alt="Loading..." />
      );
    }
    if (error) {
      return (
        <h1 className="error has-text-centered has-text-danger is-size-4">
          {errorMsg}
        </h1>
      );
    }

    return (
      <div className="container has-text-centered main">
        <nav className="navbar">
          <div className="navbart-menu">
            <div className="navbar-end">
              <Dropdown
                className="theme-options"
                options={this.themesNames}
                onChange={this.setTheme}
                placeholder={theme.scheme}
              />
              <button className="button invert-button" onClick={this.invert}>
                Invert
              </button>
              <button className="button" onClick={this.toggleType}>
                Toggle types
              </button>
              <button className="button" onClick={this.toggleRaw}>
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
            </div>
          </div>
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
              invertTheme={invertTheme}
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
