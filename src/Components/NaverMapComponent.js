import React, { useEffect, useState } from 'react';
import { UserOutlined } from '@ant-design/icons';
import { RenderAfterNavermapsLoaded, NaverMap, Marker } from 'react-naver-maps'; // 패키지 불러오기
import DB from '../Data/DB.json'
import walk from '../Images/walk.png';
import pin from '../Images/pin.png';
import curpoint from '../Images/curpoint.jpg';
import { connect } from 'react-redux';
import { actionCreators } from '../store';
import store from '../store';
import Subway from '../Data/Subway.json';
import Navibar from './Navaibar';
import axios from 'axios';
import '../CSSs/NaverMapComponent.css';

// =====================================================================================================현재위치 받아오기 위한 함수
let Currentx=37.497175, Currenty=127.027926;        //초기 위치는 강남역으로
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
        console.log(`${Currentx} , ${Currenty} 를 얻어옵니다`)
    } else {
        alert('GPS를 지원하지 않습니다');
    }
}







//====================================================================================================== 네이버지도 불러오는 함수
let navermaps;
let MarkerIndex = 0;  //마커의 key에 쓰일 index
let list, list2=[];
//var jeju = new navermaps.LatLng(33.3590628, 126.534361);

               
getLocation();

class NaverMapComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            center: { lat: Currentx, lng: Currenty },
            APIdata : [],
            MyMarkerIndex : 100,
            Markers : []
        }

        this.panToNaver = this.panToNaver.bind(this);
    }

    panToNaver() {
        let list3 = list2.filter(data=>parseInt(data.key) != this.state.MyMarkerIndex);
        console.log(`현재 나의 위치 ${Currentx} , ${Currenty}`)
        list3.push(     //새로만드는 마커의 key를 주어서 안겹치도록 아무수나 넣도록 하자.
                <Marker
                    key={this.state.MyMarkerIndex+1}
                    position={new navermaps.LatLng(Currentx, Currenty)}
                    animation={1}
                    icon={pin}
                />)
            
        list2 = list3;
        this.setState({ Markers : list2 })
        this.setState({ MyMarkerIndex : this.state.MyMarkerIndex+1})
        this.setState({ center: { lat: Currentx, lng: Currenty } })
    }




    componentWillMount() {
        navermaps = window.naver.maps;
        let Database = DB;
                                                  
        // ================================================================ api불러오는 코드
        const fetchUsers = async() => {
            console.log("fetchUsers 실행");
            try {
              const response = await axios.get(
                'http://underproject.pythonanywhere.com/api/'
              );
              // ==========================================================api에서 불러온 json 배열로 Marker를 만들어서 list2에 저장해놓는다.
              response.data.map(data=>{
                let station_information = [];
                data.elevating_equipment.map(data2=>{
                    station_information.push(`▲${data2.location}에 위치한${data2.facility} ${data2.status} \n`)
                    })
                    list2.push(
                        <Marker
                            key={data.id}
                            position={new navermaps.LatLng(Subway[data.name][0], Subway[data.name][1])}
                            animation={2}
                            onClick={()=>alert(station_information)}
                        />
                    )
                });
              this.setState({
                APIdata : response.data
              }); // 데이터는 response.data 안에 들어있습니다.
              this.props.updateState(response.data);
            } catch (e) {
              console.log(e)
            }
          };
      
          fetchUsers();
        //========================================================================현재위치 마커 추가하기                                                
        list2.push(
            <Marker
                key={this.state.MyMarkerIndex}
                position={new navermaps.LatLng(Currentx, Currenty)}
                animation={2}
                icon={walk}
            />
        )

          
    
    }

    render() {
        return (
            <div>
                <div className="position_box">
                    <button onClick={this.panToNaver} className="MyPositionBtn"></button>
                </div>
               
                <NaverMap
                    id='maps-getting-started-controlled'
                    style={{ width: '100%', height: '90vh' }}

                    // uncontrolled zoom
                    defaultZoom={13}

                    // controlled center
                    // Not defaultCenter={this.state.center}
                    center={this.state.center}                              //center변경시 render없이 화면만 따라가는 듯?
                    onCenterChanged={center => this.setState({ center })}
                   > 
                    {this.state.Markers}
                </NaverMap>
            </div>
        )
    }
}




// Redux state로부터 home에 prop으로써 전달한다는 뜻.
function mapStateToProps(state, ownProps) {
    return { storeData: state };   //toDos에 state를 가져온다.
}

// reducer에 action을 알리는 함수 
function mapDispatchToProps(dispatch) {
    return {
        updateState: fromAPI => dispatch(actionCreators.updateState(fromAPI))
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(NaverMapComponent);