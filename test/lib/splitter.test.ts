import {expect} from 'chai'

import {splitSections} from '../../src/lib/splitter.js'

describe('splitter', () => {
  it('should return whole content as "document" when no delimiters found', () => {
    const input = 'Some random content'
    const result = splitSections(input)
    expect(result).to.have.length(1)
    expect(result[0].name).to.equal('document')
    expect(result[0].content).to.equal('Some random content')
  })

  it('should split single section', () => {
    const input = 'Prefix <paperaj-intro>Content inside</paperaj-intro> Suffix'
    const result = splitSections(input)
    expect(result).to.have.length(1)
    expect(result[0].name).to.equal('intro')
    expect(result[0].content).to.equal('Content inside')
  })

  it('should split multiple sections', () => {
    const input = `
      <paperaj-intro>
        Introduction content
      </paperaj-intro>
      Middle stuff
      <paperaj-method>
        Method content
      </paperaj-method>
    `
    const result = splitSections(input)
    expect(result).to.have.length(2)
    expect(result[0].name).to.equal('intro')
    expect(result[0].content).to.contain('Introduction content')
    expect(result[1].name).to.equal('method')
    expect(result[1].content).to.contain('Method content')
  })

  it('should handle complex names', () => {
    const input = '<paperaj-Section-1_A>Content</paperaj-Section-1_A>'
    const result = splitSections(input)
    expect(result[0].name).to.equal('Section-1_A')
  })
})
