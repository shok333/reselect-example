import React, { Component, PureComponent } from "react";
import { render } from "react-dom";
import { createStore } from "redux";
import { Provider, connect } from "react-redux";
import { createSelector } from "reselect";
import { Map as ImmutableMap } from "immutable";

const initialQuestions = new ImmutableMap({
  albumName: 0,
  tracks: ["Enter sandman", "One", "Nothing else matters"]
});

const addTrack = name => {
  return {
    type: "ADD_TARCK",
    payload: name
  };
};

const changeAlbumName = name => {
  return {
    type: "CHANGE_ALBUM_NAME",
    payload: name
  };
};

//Reducers
const info = (state = initialQuestions, action) => {
  switch (action.type) {
    case "ADD_TARCK":
      return state.set("tracks", [...state.tracks, action.payload]);
    case "CHANGE_ALBUM_NAME":
      return state.set("albumName", state.albumName);
    default:
      return state;
  }
};

const myStore = createStore(info);

class Master extends Component {
  state = {
    sort: false
  };

  sortArray = createSelector(
    startTracks => startTracks,
    startTracks => {
      let tracks = [...startTracks];
      console.log(tracks.length);
      let data;
      for (let i = 0; i < tracks.length / 2; i++) {
        data = tracks[tracks.length - 1 - i];
        tracks[tracks.length - 1 - i] = tracks[i];
        tracks[i] = data;
      }
      return tracks;
    }
  );

  sortArray;

  render() {
    console.log("render");
    return [
      <h1>{this.props.albumName}</h1>,
      <ul>
        {this.state.sort
          ? this.sortArray(this.props.tracks)
          : this.props.tracks}
      </ul>,
      <button
        onClick={() => {
          this.props.addTrack(Math.random());
        }}
      >
        Add track
      </button>,
      <button
        onClick={() => {
          this.props.changeAlbumName(Math.random());
        }}
      >
        Change album name
      </button>,
      <button
        onClick={() => {
          this.setState({
            sort: !this.state.sort
          });
        }}
      >
        Sort
      </button>
    ];
  }
}

// const stepSelector = R.prop('step')
// const itemsSelector = R.prop('items')

const tracksSelector = createSelector(
  tracks => tracks,
  tracks => {
    console.log("iteration");
    return tracks.map((item, i) => <li key={i}>{item}</li>);
  }
);

const mapStateToProps = state => {
  return {
    tracks: tracksSelector(state.get("tracks")),
    albumName: state.get("albumName")
  };

  // return {
  //   step: stepSelector(state),
  //   item: itemSelector(state)
  // };
};

const mapDispatchToProps = dispatch => {
  return {
    addTrack: name => dispatch(addTrack(name)),
    changeAlbumName: name => dispatch(changeAlbumName(name))
  };
};

const MasterContainer = connect(mapStateToProps, mapDispatchToProps)(Master);

class App extends React.Component {
  render() {
    return (
      <Provider store={myStore}>
        <MasterContainer />
      </Provider>
    );
  }
}

render(<App />, document.getElementById("root"));
