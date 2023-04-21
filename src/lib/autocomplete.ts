type State = {
  [k: string]: State & { endOfWord?: boolean }
}

export default class Autocomplete {
  public state: State = {}

  public add(str: string, data: unknown) {
    this.addToState(str, data)
  }

  private addToState(str: string, data: unknown, idx = 0, state = this.state): void {
    const currentChar = str[idx]

    // Set char
    if (!(currentChar in state)) {
      state[currentChar] = {}
    }

    // if last char
    if (idx === str.length - 1) {
      state[currentChar].endOfWord = true
      return
    }

    return this.addToState(str, data, idx + 1, state[currentChar])
  }

  public search(str: string) {
    let branch = this.state
    for (let i = 0; i < str.length; i++) {
      if (str[i] in branch) {
        branch = branch[str[i]]
      } else {
        return []
      }
    }

    return this.getValues(branch).sort((a, b) => a.length - b.length)
  }

  private getValues(state: State, res = [] as string[], stringSoFar = '') {
    for (const k in state) {
      if (k === 'endOfWord' && stringSoFar) {
        res.push(stringSoFar)
      } else {
        this.getValues(state[k], res, stringSoFar + k)
      }
    }
    return res
  }
}
