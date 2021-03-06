import './main.scss'

import 'babel-polyfill'

import React, {Component} from 'react'
import {render} from 'react-dom'

import {createStore, combineReducers, applyMiddleware} from 'redux'
import {Provider} from 'react-redux'
import thunk from 'redux-thunk'

import {Router, Route, IndexRoute, Redirect, browserHistory} from 'react-router'
import {syncHistoryWithStore, routerReducer} from 'react-router-redux'

import { is } from 'ramda'

// Reducers
import postsReducer from 'posts/posts_reducer'
import postsIndexReducer from 'posts/posts_index/posts_index_reducer'

const reducer = combineReducers({
  routing: routerReducer,
  posts: postsReducer,
  postsIndex: postsIndexReducer
})

const middleware = applyMiddleware(thunk)
const store = createStore(reducer, middleware)
const history = syncHistoryWithStore(browserHistory, store)

// Components
import PostIndex from './posts/posts_index/posts_index'
import PostShow from './posts/posts_show'

class App extends Component {
  render() {
    return <div className="wrapper">
      <h1 className="wrapper_title">My Cool Blog</h1>
      {this.props.children}
    </div>
  }
}

function forceRemount(Component, props) {
  if (props.route.composeId) {
    props.params.id = `${props.params.idScope}/${props.params.idValue}`
  }

  if (props.route.forceRemount) {
    const key = is(String, props.route.forceRemount) ? props.params[props.route.forceRemount] : props.location.key
    return <Component key={ key } {...props} />
  } else {
    return <Component {...props} />
  }
}

render((
  <Provider store={ store }>
    <Router history={ history } createElement={forceRemount} onUpdate={ () => window.scrollTo(0, 0) }>
      <Route path="/" component={ App }>
        <IndexRoute component={PostIndex} forceRemount={true}/>
        <Route path="/:id" component={PostShow} />
      </Route>
    </Router>
  </Provider>
), document.getElementById('app'))
