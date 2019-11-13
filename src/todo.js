import { applySnapshot, onSnapshot } from 'mobx-state-tree';

var state = [];
var currentFrame = -1;

onSnapshot(store, snapshot => {
    if (currentFrame === state.length - 1) {
        currentFrame++
        state.push(snapshot)
    }
})

export function previousState() {
    if (currentFrame === 0) return
    currentFrame--
    applySnapshot(store, states[currentFrame])
}

export function nextState() {
    if (currentFrame === state.length - 1) return
    currentFrame++
    applySnapshot(store, states[currentFrame])
}