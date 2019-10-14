const createAnswerDOM = decision => {
  const answer = document.createElement('span')
  answer.classList.add('answer-span')

  let count = 0
  const printInterval = setInterval(() => {
    answer.innerHTML = decision.substring(0, count)

    if (count === decision.length) clearInterval(printInterval)
    count++
  }, 20)

  return answer
}

const createDOMNode = (label, isNormal = false) => {
  const promptWrapper = document.createElement('li')

  const text = isNormal ? 'Is it a ' + label + '?' : label

  promptWrapper.classList.add('prompt-wrapper')

  let count = 0
  const printInterval = setInterval(() => {
    promptWrapper.innerHTML = text.substring(0, count)

    if (count === text.length) clearInterval(printInterval)
    count++
  }, 20)

  return promptWrapper
}

class Node {
  constructor(label, isNormal = true) {
    this.label = label
    this.isNormal = isNormal

    this.left = null
    this.right = null
  }

  setLeft = node => {
    this.left = node
  }

  setRight = node => {
    this.right = node
  }

  getElement = () => {
    return createDOMNode(this.label, this.isNormal)
  }
}

const loadNode = obj => {
  const myNode = new Node(obj.label)

  if (obj.left) {
    const leftNode = loadNode(obj.left)
    myNode.setLeft(leftNode)
  }
  if (obj.right) {
    const rightNode = loadNode(obj.right)
    myNode.setRight(rightNode)
  }

  return myNode
}
