const LEFT = 'left'
const RIGHT = 'right'

class Guesser {
  constructor() {
    this.root = new Node('Animal')

    /** DEFAULTS */
    const yesAnimal = new Node('Turtle')
    const noAnimal = new Node('Garbage Can')

    this.root.setLeft(noAnimal)
    this.root.setRight(yesAnimal)

    this.curr = this.root

    this.decision = null

    this.ended = false
  }

  yes = () => {
    if (this.ended) {
      // MEANS PLAYER WANT TO RESTART
      this.restart()
      return true
    }

    this.decision = RIGHT

    this.curr = this.curr.right

    return this.curr
  }

  no = () => {
    if (this.ended) {
      // MEANS PLAYER DO NOT WANT TO RESTART
      promptsWrapper.appendChild(createDOMNode('Thanks for playing!'))
      document.removeEventListener('keyup', keyUpHandler)
      return true
    }

    this.decision = LEFT

    if (!this.curr.left) return false
    this.curr = this.curr.left

    return this.curr
  }

  succeed = () => {
    this.ended = true
  }

  fail = () => {
    this.ended = true
  }

  restart = () => {
    promptsWrapper.innerHTML = ''

    this.curr = this.root

    this.decision = null
    this.ended = false
  }

  addNode = (prompt, answer) => {
    const leftNode = new Node(this.curr.label)
    const rightNode = new Node(answer)

    this.curr.label = prompt

    this.curr.setLeft(leftNode)
    this.curr.setRight(rightNode)
  }

  load = JSONObj => {
    promptsWrapper.innerHTML = ''
    this.root = loadNode(JSONObj)

    inputSection.innerHTML = ''
    inputSection.appendChild(inputYesNo)

    inputState = YESNO

    prompt = null
    answer = null

    this.curr = this.root

    this.decision = null
    this.ended = false
  }

  getCurrent = () => {
    if (this.ended) return new Node('Finally! Wanna play again?', false)
    return this.curr
  }
}
