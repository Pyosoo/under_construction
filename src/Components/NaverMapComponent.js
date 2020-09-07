import React, { useEffect, useState } from 'react';
import { UserOutlined } from '@ant-design/icons';
import { RenderAfterNavermapsLoaded, NaverMap, Marker } from 'react-naver-maps'; // 패키지 불러오기
import { connect } from 'react-redux';
import { actionCreators } from '../store';
import axios from 'axios';
import { Modal, Button } from 'antd';
import swal from 'sweetalert';

// Image import
import DB from '../Data/DB.json'
import walk from '../Images/walk.png';
import pin from '../Images/pin.png';
import curpoint from '../Images/curpoint.jpg';

// Component import
import 'antd/dist/antd.css';
import store from '../store';
import Subway from '../Data/Subway.json';
import Navibar from './Navaibar';
import '../CSSs/NaverMapComponent.css';
import Sidebox from './Sidebox';



// =====================================================================================================현재위치 받아오기 위한 함수
let Currentx=37.497175, Currenty=127.027926;        //초기 위치는 강남역으로
let MyX, MyY;
function getLocation() {
    console.log("getLocatoin 실행");
    if (navigator.geolocation) { // GPS를 지원하면
        navigator.geolocation.getCurrentPosition(function (position) {
            MyX = position.coords.latitude;                               // 사용자의 현재 위치를 받아와서 초기값으로 넣어주기 위함
            MyY = position.coords.longitude;
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

let arrivelist = '';
// ■■■■■■■■■■■■■■■■■■■■■■■■■■■ 로드 시 지하철 실시간 도착 정보 받아오기 ■■■■■■■■■■■■■■■■■■■■■■■■■■■
const getStationTimeData = async(subwayname) => {
    arrivelist = '';    //이전에 있던 데이터를 지워주고
    try{
        const response = await axios.get(`http://swopenapi.seoul.go.kr/api/subway/43626f6279736e73313031726e5a7044/json/realtimeStationArrival/0/999/${subwayname}`);
        console.log(response.data.realtimeArrivalList);
        response.data.realtimeArrivalList.map(data=>{
            arrivelist += `${data.trainLineNm} ${data.arvlMsg2} \n`
        }) 
    } catch(e){
        console.log(e);
    }
/*
    axios.get(`http://swopenapi.seoul.go.kr/api/subway/43626f6279736e73313031726e5a7044/json/realtimeStationArrival/0/999/${subwayname}`)
        .then(response => {
            //응답 성공시
            console.log(response.data.realtimeArrivalList);
            
            response.data.realtimeArrivalList.map(data=>{
                arrivelist += `${data.trainLineNm} ${data.arvlMsg2} + '\n'`
            }) 
            alert(arrivelist)
        })
        .catch(e => {
            console.log(e);
        });*/
}








//========================================== 네이버지도 불러오는 함수 ============================================================
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
            MyMarkerIndex : 999,
            Markers : [],
            visible : true,
        }

        this.panToMe = this.panToMe.bind(this);
    }

    panToMe() {
        let list3 = list2.filter(data=>parseInt(data.key) != this.state.MyMarkerIndex);
        list3.push(     //새로만드는 마커의 key를 주어서 안겹치도록 아무수나 넣도록 하자.
                <Marker
                    key={this.state.MyMarkerIndex+1}
                    position={new navermaps.LatLng(MyX, MyY)}
                    animation={1}
                    icon={pin}
                />)
            
        list2 = list3;
        this.setState({ Markers : list2 })
        this.setState({ MyMarkerIndex : this.state.MyMarkerIndex+1})
        this.props.updateState(this.props.storeData.fromAPI, MyX, MyY);
    }



    checkCenter(){
        // 만약 현재 store에 저장된 x,y가 subway에 저장되어있는 값과 같은게 있다면 
        // setState center를 통해 이동하면된다.
        for(let key in Subway){
            if(Subway[key][0] == this.props.storeData.clikedX){
                this.props.updateState(this.props.storeData.fromAPI, Currentx, Currenty);
                this.setState({center : {lat: Subway[key][0], lng: Subway[key][1]}});
                break;
            }
        }
    }



    componentWillMount() {
        navermaps = window.naver.maps;
        let Database = DB;
        // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ 지하철 공사중인 Data api불러오는 코드 ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
        const fetchUsers = async() => {
            console.log("fetchUsers 실행");
            try {
              const response = await axios.get(
                'https://underproject.pythonanywhere.com/api/'
              );
              // api에서 불러온 json 배열로 Marker를 만들어서 list2에 저장해놓는다.
              response.data.map(data=>{
                let station_information = [];
                data.elevating_equipment.map(data2=>{
                    station_information.push(`▲${data2.location} ${data2.facility}  상태:${data2.status} \n`)
                    })
                    list2.push(
                        <Marker
                            key={data.id}
                            position={new navermaps.LatLng(Subway[data.name][0], Subway[data.name][1])}
                            animation={2}
                            onClick={()=>{
                                getStationTimeData(data.name);      // aysnc await로 api에서 데이터를 읽어 arrivelist에 저장한다
                                
                                swal(`${data.name}역`, {
                                    buttons: {
                                      공사정보: {
                                        value : "const"
                                      },
                                      도착정보: {
                                        value: "arrive",
                                      }
                                    },
                                  })
                                  .then((value) => {
                                    switch (value) {
                                      case "const":
                                        swal(station_information.join(''));
                                        break;
                                   
                                      default:
                                        swal(arrivelist);
                                    }
                                  });


                                }
                            }
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
          this.props.updateState(this.props.storeData.fromAPI,Currentx, Currenty);

        //◆현재위치 마커 추가하기                                                
        list2.push(
            <Marker
                key={this.state.MyMarkerIndex}
                position={new navermaps.LatLng(Currentx, Currenty)}
                animation={2}
                icon={walk}
            />
        )


    }

    // 맨 처음 공지사항 모달 관련 
    handleOk = e => {
        this.setState({
          visible: false,
        });
        this.panToMe();
      };









    render() {
        console.log("네이버맵 랜더")
        return (
            <div>
                <div className="position_box">
                    <button onClick={this.panToMe} className="MyPositionBtn"></button>
                </div>
                {/* ant-modal-content 가 class명 기본 */}
                <Modal
                    className="start_Modal" 
                    title="Notice"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    footer={[null,null]}
                >
                    <p className="ant-modal-content-header">승강시설 공사중 지하철역</p>
                    <p className="ant-modal-content-content">이 사이트는 내 주위에 승강시설 정비중인 지하철에 대한 정보를 제공합니다.<br />
                     원활한 서비스 이용을 위해 현재 위치를 허용해주어 더 빠르게 서비스를 이용할 수 있도록 해주세요.
                     <br/>위치 정보 수집 허용 후 확인을 눌러주세요
                     <button className="button2 btn2" onClick={this.handleOk}>확인</button>
                    </p>
                </Modal>
                <Sidebox />
                {/* redux 통한 update이 좌표 update가 되면 render되어 화면 center이동 */}
                <NaverMap
                    id='Mymap'
                    style={{ width: '100%', height: '93.36vh' }}
                    defaultZoom={16}
                    center={{ lat: this.props.storeData.clikedX, lng: this.props.storeData.clikedY }}
                   > 
                    {this.state.Markers}
                </NaverMap>
            </div>
        )
    }
}






// Redux state로부터 home에 prop으로써 전달한다는 뜻.
function mapStateToProps(state, ownProps) {
    return { storeData: state };   //storeData에 state를 가져온다.
}

// reducer에 action을 알리는 함수 
function mapDispatchToProps(dispatch) {
    return {
        updateState: (fromAPI,x,y) => dispatch(actionCreators.updateState(fromAPI,x,y))
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(NaverMapComponent);