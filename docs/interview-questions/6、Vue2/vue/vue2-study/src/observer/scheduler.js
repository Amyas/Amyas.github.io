import { nextTick } from "../utils"

let queue = []
let has = {}

let pending = false

function fluashSchedulerQueue(){
  for(let i = 0;i<queue.length;i++) {
    queue[i].run()
  }
  queue = []
  has = {}
  pending = false
}

export function queueWatcher(watcher) {
  const id = watcher.id
  if(has[id] === null || has[id] === undefined) {
    queue.push(watcher)
    has[id] = true

    if(!pending) {
      nextTick(fluashSchedulerQueue, 0);
      pending = true
    }
  }

}