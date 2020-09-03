import { createStore } from "redux";

/*
    store 컴포넌트에서 하는 일
    1. action 객체에서 쓸 변수명을 만든다
    2. action 객체를 생성한다.
    3. reducer를 생성한다.(reducer에서는 action을 어떻게 처리할지에 대한 함수가 작성된다)
    4. store를 생성해주고 reducer를 연결해준다.
    5. 만들었던 action들을 actionCreators로 만들어서 export해주어 다른 컴포넌트에서 사용할 수 있게 해준다.
*/



//1. 변수명을 지정해둔다.
        //const ADD = "ADD";
        //const DELETE = "DELETE";
const UPDATE = "UPDATE";

//2. action 객체를 생성해 놓는다.
const updateState = (fromAPI, x, y) => {
    return{
        type: UPDATE,
        fromAPI,
        x,
        y
    }
}

//3. reducer를 생성한다. state와 action을 입력 받고 바뀐 결과 state를 return 한다.
const reducer = (state = {fromAPI : [], clikedX:0, clikedY:0}, action) =>{
    switch(action.type){
        case UPDATE:
            console.log("update store");
            return {
                fromAPI : action.fromAPI,
                clikedX : action.x,
                clikedY : action.y
            };
        default:
            return state;
    }
};

//4. store 객체를 생성하는데 reducer를 매개변수로 갖고 시작한다.
const store = createStore(reducer);

//5. 내가 만든 action들을 다른 컴포넌트에서 쓸수 있도록 묶어서 export해준다.
export const actionCreators = {
    updateState
}

export default store;