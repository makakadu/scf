const CHANGE = 'CHANGE'

let initialState = {
    testObj: {}, // компонент перерендерится только если будет сделана глубокая копия state, то есть testObj будет ссылаться на новый объект. Если же копирование будет НЕ глубоким, но при этом, например, в testObj было изменено свойство, то компонент не будет перерисован, потому что testObj является тем же самым объектом.
    primitive: 'pechen'
};

const testReducer = (state = initialState, action) => {
    switch (action.type) {
        case CHANGE:
            console.log('change')
            state.testObj.lol = 'kek'
            state.primitive = 'kakashka'
            return {...state}
        default:
            return state;
    }
}

//export let change = () => ({
//    type: CHANGE
//})

export default testReducer;
