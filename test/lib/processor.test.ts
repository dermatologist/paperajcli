import {expect} from 'chai'

import {processLatex} from '../../src/lib/processor.js'

describe('processor', () => {
  it('should handle TWOCOLUMN figure', () => {
    // Note: Python logic splits by ':' and checks caption[1].
    // So "TWOCOLUMN" must be in the first part after "Figure X".
    // "Figure 2: Wide Fig TWOCOLUMN: ..." -> caption[1] = " Wide Fig TWOCOLUMN"

    const input = [
      'Figure 2: Wide Fig TWOCOLUMN',
      String.raw`\begin{figure}`,
      String.raw`\caption{image}`,
      String.raw`\end{figure}`
    ].join('\n')

    const result = processLatex(input)
    expect(result).to.include(String.raw`\begin{figure*}`)
    expect(result).to.include(String.raw`\end{figure*}`)
    // "TWOCOLUMN" is replaced by empty string, so "Wide Fig " -> trimmed "Wide Fig"
    expect(result).to.include(String.raw`\caption{Wide Fig}`)
  })

  it('should handle LATEXROTATE figure', () => {
    const input = [
      'Figure 3: Rotated LATEXROTATE',
      String.raw`\begin{figure}`,
      String.raw`\caption{image}`,
      String.raw`\end{figure}`
    ].join('\n')

    const result = processLatex(input)
    expect(result).to.include(String.raw`\begin{sidewaysfigure}`)
    expect(result).to.include(String.raw`\end{sidewaysfigure}`)
    expect(result).to.include(String.raw`\caption{Rotated}`)
  })

  // Basic case for no options
  it('should handle simple figure without options', () => {
    const input = [
      'Figure 1: My Caption',
      String.raw`\begin{figure}`,
      String.raw`\caption{image}`,
      String.raw`\end{figure}`
    ].join('\n')

    const result = processLatex(input)
    expect(result).to.include(String.raw`\label{Figure_1}`)
    expect(result).to.include(String.raw`\caption{My Caption}`)
  })

  it('should replace image caption placeholders', () => {
     const input = [
      'Figure 1: Test',
      String.raw`\caption{Diagram Description automatically generated}`
     ].join('\n')

     const result = processLatex(input)
     expect(result).to.include(String.raw`\caption{Test}`)
  })

  it('should handle Table captions and Longtable', () => {
    const input = [
      'Table 1: My Table',
      String.raw`\begin{longtable}`
    ].join('\n')

    const result = processLatex(input)
    expect(result).to.include(String.raw`\caption{My Table}`)
    expect(result).to.include(String.raw`\label{Table_1}`)
  })

  it('should handle Table midrule split', () => {
    const input = [
      'Table 2: Continued Table',
      String.raw`\midrule`
    ].join('\n')

    const result = processLatex(input)
    expect(result).to.include('Continued: Continued Table}')
    expect(result).to.include(String.raw`\endfirsthead`)
  })

  it('should fix references', () => {
    const input = String.raw`See Figure\_1 and Table\_2 and Appendix\_A properly.`
    const result = processLatex(input)
    expect(result).to.include(String.raw`See  Figure \ref{Figure_1} and  Table \ref{Table_2} and  Appendix \ref{Appendix_A} properly.`)
  })

  it('should remove "et al."', () => {
    const input = 'Smith et al. showed that...'
    const result = processLatex(input)
    // "Smith et al. showed" -> replace(" et al.", "") -> "Smith showed"
    expect(result).to.equal('Smith showed that...')
  })

  it('should remove "et. al" across line breaks', () => {
    const input = 'Smith et.\nal showed that...'
    const result = processLatex(input)
    expect(result).to.equal('Smith showed that...')
  })

  it('should replace special chars', () => {
    const input = String.raw`Text -/-/- Text \{ \}`
    const result = processLatex(input)
    // "Text -/-/- Text" -> "Text --- Text"
    expect(result).to.include('Text --- Text { }')
  })
})
