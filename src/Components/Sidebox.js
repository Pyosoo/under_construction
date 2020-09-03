import React from 'react';
import '../CSSs/Sidebox.css';
import store from '../store';
import { connect } from 'react-redux';
import { actionCreators } from '../store';
import Subway from '../Data/Subway.json';



function Sidebox(props){
    console.log("sidebox render")
    let list = []; //공사중인 지하철역에 대한 element요소를 담아둘 배열
    props.storeData.fromAPI.map(data=>{
        list.push(
            <div key={data.id} id={Subway[data.name]} onClick={(e)=>{
                //해당 div클릭시 store에 그 좌표를 update해줘서 좌표로 지도이동할수있도록하기
                e.preventDefault();
                props.updateState(props.storeData.fromAPI, Subway[data.name][0],  Subway[data.name][1]);
            }} className="Sidebox_listitem">
                <p>{data.name}역</p>
            </div>
        )
    })

    return(
        <div className="Box_Container">
            <h3 className="Sidebox_header">공사중 지하철역 목록</h3>
            {list}
        </div>
    )
}

// Redux state로부터 home에 prop으로써 전달한다는 뜻.
function mapStateToProps(state, ownProps) {
    return { storeData: state };   //toDos에 state를 가져온다.
}

// reducer에 action을 알리는 함수 
function mapDispatchToProps(dispatch) {
    return {
        updateState: (fromAPI,x,y) => dispatch(actionCreators.updateState(fromAPI,x,y))
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(Sidebox);