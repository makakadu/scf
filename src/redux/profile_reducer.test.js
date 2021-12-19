import profileReducer, {addPost, deletePublication} from './profile_reducer.js'

let state = {
    publications: [
        {id: 1, authorName: 'Igor Vasin', text: 'В тебе грайма нет, бро, ты говноед'},
        {id: 2, authorName: 'Anton Zorin', text: 'Йоу, йоу'},
        {id: 3, authorName: 'Gena Bukin', text: 'Я люблю, когда ...!'}
    ]
}

it('new post should be added', () => {
    let action = addPost('Женя', 'Я упорыш')
    let newState = profileReducer(state, action)
    expect(newState.publications.length).toBe(4)
})

it('author name of new post should be Игорь', () => {
    let action = addPost('Игорь', 'Я упорыш')
    let newState = profileReducer(state, action)
    expect(newState.publications[3].authorName).toBe('Игорь') // хз почем, но publications обнуляются после первого теста, наверное здесь так работает тестирование
})

it('text of new publication should be "Я упорыш"', () => {
    let action = addPost('Игорь', 'Я упорыш')
    let newState = profileReducer(state, action)
    expect(newState.publications[3].text).toBe('Я упорыш')
})

it('text of new publication should be 4', () => {
    let action = addPost('Игорь', 'Я упорыш')
    let newState = profileReducer(state, action)
    expect(newState.publications[3].id).toBe(4)
})

it('publications length won\'t change if was passed incorrect id', () => {
    let action = deletePublication(6)
    let newState = profileReducer(state, action)
    expect(newState.publications.length).toBe(3)
})

it('publications length should be decrement after delete publication', () => {
    let action = deletePublication(1)                                            // TDD. Пишем то что нам нужно, не важно существует ли такая функция.
                                                                                 // Если deletePublication не существует, то тест провалится и будет написана причина провала
                                                                                 // После этого создадим deletePublication в profile_reducer.js и импортируем

                                                                                 // Затем мы увидим, что тест провалился потому константы DELETE_PUBLICATION не существует
                                                                                 // после её создания тест будет пройден.
                                                                                 // После этого пишем следующую строку
    let newState = profileReducer(state, action)
                                                                                 // тест будет пройден. Затем добавляем ожидание, в котором будем ждать, что один из постов
                                                                                 // будет удалён:
    expect(newState.publications.length).toBe(2)
                                                                                 //  но пост не будет удалён ведь profileReducer не ожидает такого case, поэтому тест будет провален
                                                                                 // поэтому редактируем profileReducer добавляя такой case

})
