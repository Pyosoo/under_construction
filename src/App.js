import React from 'react';
import { RenderAfterNavermapsLoaded } from 'react-naver-maps'; // 패키지 불러오기
import './App.css';
import NaverMapComponent from './Components/NaverMapComponent.js';
import { connect } from 'react-redux';
import { actionCreators } from './store';
import Navibar from './Components/Navaibar';

/*
const express = require('express');
var cors = require('cors')
const app = express();
*/



function App(props) {

//  console.log("App render");
  return (
    <div>
      <Navibar />
      <RenderAfterNavermapsLoaded
        ncpClientId={'ce25x52vaf'} // 자신의 네이버 계정에서 발급받은 Client ID
        error={<p>Maps Load Error</p>}
        loading={<p>Maps Loading...</p>}
      >
       <NaverMapComponent />
      </RenderAfterNavermapsLoaded>
    </div>
  );
}


// app.use(cors());




















/* Redux를 사용하는 컴포넌트에서의 역할
    1. mapStateToProps(state, ownProps) 를 만든다 (이는 Props로 state를 가져오겠다는 것)
    2. mapDispatchToProps(dispatch) 를 만든다 (이는 이 컴포넌트에서 state를 변경할 수 있게 해준다, 여기선 등록하는 일만 할 것이므로 addToDo만 return 된 것이다.);
    3. 컴포넌트와 앞서 만든 함수들을 connect해준다. connect는 컴포넌트에서 store에 접근할 수 있게 연결을 해주는 것이다.
*/


// Redux state로부터 home에 prop으로써 전달한다는 뜻.
function mapStateToProps(state, ownProps){
  return { storeData : state };   //toDos에 state를 가져온다.
}

// reducer에 action을 알리는 함수 
function mapDispatchToProps(dispatch){
  return {
      updateState : (x, y) => dispatch(actionCreators.updateState(x,y))
   };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);