const guesser = new Guesser()

const promptsWrapper = document.getElementById('prompts-wrapper')
const inputSection = document.getElementById('input-wrapper')
const openFileInput = document.getElementById('open-file-input')
const saveFileWrapper = document.getElementById('save-file-wrapper')

const inputInput = document.createElement('input')
inputInput.id = 'input-input'
const inputYesNo = document.createElement('p')
inputYesNo.innerHTML = 'Y=Yes&#09;&#09;N=No'

let prevRoundPromptEle
function nextRound(text) {
  let ele = text ? createDOMNode(text) : guesser.getCurrent().getElement()
  promptsWrapper.appendChild(ele)
  prevRoundPromptEle = ele
}

function start() {
  nextRound()
}

const YESNO = 'yesno'
const TYPING = 'typing'

let inputState = YESNO
let prompt = null
let answer = null

const keyUpHandler = e => {
  const { keyCode } = e

  if (inputState === YESNO) {
    if (keyCode === 89) {
      const response = guesser.yes()
      prevRoundPromptEle.appendChild(createAnswerDOM('Yes'))

      if (!response) guesser.succeed()
      nextRound()
    } else if (keyCode === 78) {
      const response = guesser.no()
      prevRoundPromptEle.appendChild(createAnswerDOM('No'))

      if (!response) {
        inputSection.innerHTML = ''
        inputSection.appendChild(inputInput)
        inputInput.focus()
        inputState = TYPING
        nextRound('What is it then? (It is a...)')
      } else if (!guesser.ended) {
        nextRound()
      }
    }
  } else {
    if (keyCode === 13) {
      const val = inputInput.value
      if (answer) {
        prompt = val

        guesser.addNode(prompt, answer)

        prevRoundPromptEle.appendChild(createAnswerDOM(prompt))

        prompt = null
        answer = null

        inputState = YESNO

        inputSection.innerHTML = ''
        inputSection.appendChild(inputYesNo)

        guesser.fail()
        nextRound()
      } else {
        answer = val
        prevRoundPromptEle.appendChild(createAnswerDOM(answer))
        nextRound('What makes it different from a ' + guesser.curr.label + '? (It is...)')
      }

      inputInput.value = ''
    }
  }
}

document.addEventListener('keyup', keyUpHandler, false)

function downloadObjectAsJson(exportObj, exportName) {
  var dataStr =
    'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportObj))
  var downloadAnchorNode = document.createElement('a')
  downloadAnchorNode.setAttribute('href', dataStr)
  downloadAnchorNode.setAttribute('download', exportName + '.json')
  document.body.appendChild(downloadAnchorNode) // required for firefox
  downloadAnchorNode.click()
  downloadAnchorNode.remove()
}

saveFileWrapper.addEventListener('click', () => {
  const guesserJSON = JSON.parse(JSON.stringify(guesser.root))
  downloadObjectAsJson(guesserJSON, 'guesser' + new Date().toISOString())
})

const importData = e => {
  promptsWrapper.innerHTML = 'loading...'
  const reader = new FileReader()
  reader.onload = function(e) {
    const JSONObj = JSON.parse(e.target.result)
    guesser.load(JSONObj)
    start()
  }

  try {
    reader.readAsText(e.target.files[0])
  } catch (e) {
    console.log('Unable to read file.')
  }
}

openFileInput.addEventListener('change', importData)

start()
