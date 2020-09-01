import React, { useEffect, useState } from 'react';
import { UserOutlined } from '@ant-design/icons';
import { RenderAfterNavermapsLoaded, NaverMap, Marker } from 'react-naver-maps'; // 패키지 불러오기
import DB from '../Data/DB.json'
import walk from '../Images/walk.png';
import { connect } from 'react-redux';
import { actionCreators } from '../store';
import store from '../store';
import Subway from '../Data/Subway.json';



// =====================================================================================================현재위치 받아오기 위한 함수
let Currentx, Currenty;
function getLocation() {
  console.log("getLocatoin 실행");
  if (navigator.geolocation) { // GPS를 지원하면
    navigator.geolocation.getCurrentPosition(function (position) {
      Currentx = position.coords.latitude;                               // 사용자의 현재 위치를 받아와서 초기값으로 넣어주기 위함
      Currenty = position.coords.longitude;
    }, function (error) {
      console.error(error);
    }, {
      enableHighAccuracy: false,
      maximumAge: 0,
      timeout: Infinity
    });
  } else {
    alert('GPS를 지원하지 않습니다');
  }
}
getLocation();







//====================================================================================================== 네이버지도 불러오는 함수
let navermaps;
let MarkerIndex = 0;  //마커의 key에 쓰일 index

//var jeju = new navermaps.LatLng(33.3590628, 126.534361);

function NaverMapComponent(props) {
  console.log("NaverMapAPI render");
  console.log(props.fromStore);
  
  const {updateState} = props;

  const GetgetLocation = (e) => {
    console.log("나의 위치를 다시 파악합니다");
    getLocation();
    updateState(Currentx, Currenty);
  }

  navermaps = window.naver.maps;
  let DB1 = DB;
  let list;
  let list2 = [];

  for(let key in Subway){
    list2.push(
      <Marker
        key={MarkerIndex++}
        position={new navermaps.LatLng(Subway[key][0], Subway[key][1])}
        animation={2}
      />
    )
  }

  list = DB1.map(data => {
    return (
      <Marker
        key={MarkerIndex++}
        position={new navermaps.LatLng(data.x, data.y)}
        animation={2}
        onClick={() => {
          alert(data.desc);
        }}
      />
    )
  })

  return (
    <div>
      <button onClick={GetgetLocation} >클릭</button>
      <NaverMap
        mapDivId={'Mymap'} // default: react-naver-map
        style={{
          width: '100%', // 네이버지도 가로 길이
          height: '100vh' // 네이버지도 세로 길이
        }}
        defaultCenter={new navermaps.LatLng(props.goX, props.goY)} // 지도 초기 위치
        defaultZoom={14} // 지도 초기 확대 배율
      >
        <Marker   //현재 위치 Marker
          key={1}
          position={new navermaps.LatLng(Currentx, Currenty)}
          animation={2}
          icon={walk}
        />
        {list}
        {list2}
      </NaverMap>
    </div>
  );
}





// Redux state로부터 home에 prop으로써 전달한다는 뜻.
function mapStateToProps(state, ownProps){
  return { fromStore : state };   //toDos에 state를 가져온다.
}

// reducer에 action을 알리는 함수 
function mapDispatchToProps(dispatch){
  return {
      updateState : (x, y) => dispatch(actionCreators.updateState(x,y))
   };
}


export default connect(mapStateToProps, mapDispatchToProps)(NaverMapComponent);