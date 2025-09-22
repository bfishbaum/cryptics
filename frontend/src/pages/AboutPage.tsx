import React from 'react';

export const AboutPage: React.FC = () => {
  return (
    <div className="container">
      <div className="white-box">
        <h1 className="page-title">About Cryptic Crosswords</h1>

        <div style={{ textAlign: 'left', maxWidth: '800px', margin: '0 auto' }}>
          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '24px', marginBottom: '15px' }}>What Are Cryptic Crosswords?</h2>
            <p style={{ marginBottom: '15px' }}>
              Cryptic crosswords are a type of word puzzle where each clue contains both a definition (like a regular crossword clue)
              and a wordplay element that leads to the answer. The wordplay and definition are always split and shouldn't overlap.
              This makes cryptic crosswords more challenging and fun, as you need to decipher not only what the definition means, but also what it is!
            </p>
            <p style={{ marginBottom: '15px' }}>
              For more detailed information about cryptic crosswords, visit the{' '}
              <a
                href="https://en.wikipedia.org/wiki/Cryptic_crossword"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#007bff', textDecoration: 'underline' }}
              >
                Wikipedia page for Cryptic Crosswords
              </a>.
            </p>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '24px', marginBottom: '15px' }}>Basic Rules and Structure</h2>

            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>1. Two-Part Clues</h3>
              <p style={{ marginBottom: '10px' }}>
                Every cryptic clue has two parts: a <strong>definition</strong> and <strong>wordplay</strong>.
                One part gives you the meaning of the answer, while the other tells you how to construct it.
              </p>
              <div style={{
                background: '#f8f9fa',
                padding: '15px',
                borderRadius: '6px',
                border: '1px solid #dee2e6',
                fontFamily: 'monospace',
                marginBottom: '10px'
              }}>
                Example: Old boy starts delivering food and playing detective (6)" → <br />
                <span style={{ fontSize: '14px', color: '#6c757d' }}>
                  • Definition: "playing detective" → OBSERVING<br />
                  • Wordplay 1: "OLD BOY Starts" → OB (the starts of Old and Boy)<br />
                  • Wordplay 2: "Delivering food" → SERVING<br />
                  • Combine OB + SERVING = OBSERVING
                </span>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>2. Common Wordplay Types</h3>

              <div style={{ marginBottom: '25px' }}>
                <h4 style={{ fontSize: '16px', marginBottom: '8px', fontWeight: 'bold' }}>Anagrams</h4>
                <p style={{ marginBottom: '10px' }}>Rearranging letters (indicated by words like "mixed", "confused", "broken")</p>
                <div style={{
                  background: '#f8f9fa',
                  padding: '12px',
                  borderRadius: '6px',
                  border: '1px solid #dee2e6',
                  fontFamily: 'monospace',
                  fontSize: '14px'
                }}>
                  <strong>Examples:</strong><br />
                  • "Mixed up skate | steals (6)" → TAKES<br />
                  • "Broken rewards holds | undies (7)" → DRAWERS<br />
                </div>
              </div>

              <div style={{ marginBottom: '25px' }}>
                <h4 style={{ fontSize: '16px', marginBottom: '8px', fontWeight: 'bold' }}>Hidden Words</h4>
                <p style={{ marginBottom: '10px' }}>Answer hidden within the clue (indicated by "in", "within", "inside")</p>
                <div style={{
                  background: '#f8f9fa',
                  padding: '12px',
                  borderRadius: '6px',
                  border: '1px solid #dee2e6',
                  fontFamily: 'monospace',
                  fontSize: '14px'
                }}>
                  <strong>Examples:</strong><br />
                  • "Look at this penguin, an' it yields frivolity (7)" → INANITY<br />
                  • "Don't harm us, I can carry a tune! (5)" → MUSIC<br />
                </div>
              </div>

              <div style={{ marginBottom: '25px' }}>
                <h4 style={{ fontSize: '16px', marginBottom: '8px', fontWeight: 'bold' }}>Reversals</h4>
                <p style={{ marginBottom: '10px' }}>Answer spelled backwards (indicated by "back", "returned", "reversed")</p>
                <div style={{
                  background: '#f8f9fa',
                  padding: '12px',
                  borderRadius: '6px',
                  border: '1px solid #dee2e6',
                  fontFamily: 'monospace',
                  fontSize: '14px'
                }}>
                  <strong>Examples:</strong><br />
                  • "Come back and nibble on a tie (6)" → BIND<br />
                  • "He ran sneakily, backwards into a trap (7)" → SNARE<br />
                </div>
              </div>

              <div style={{ marginBottom: '25px' }}>
                <h4 style={{ fontSize: '16px', marginBottom: '8px', fontWeight: 'bold' }}>Homophones</h4>
                <p style={{ marginBottom: '10px' }}>Sounds like another word or letters (indicated by "sounds", "heard", "radio")</p>
                <div style={{
                  background: '#f8f9fa',
                  padding: '12px',
                  borderRadius: '6px',
                  border: '1px solid #dee2e6',
                  fontFamily: 'monospace',
                  fontSize: '14px'
                }}>
                  <strong>Examples:</strong><br />
                  • "Any sound wins novel (5)" → NEW<br />
                  • "Hear the sea, the boil" (6)" → SEETHE<br />
                </div>
              </div>

              <div style={{ marginBottom: '25px' }}>
                <h4 style={{ fontSize: '16px', marginBottom: '8px', fontWeight: 'bold' }}>Abbreviations</h4>
                <p style={{ marginBottom: '10px' }}>Using common abbreviations or initials</p>
                <div style={{
                  background: '#f8f9fa',
                  padding: '12px',
                  borderRadius: '6px',
                  border: '1px solid #dee2e6',
                  fontFamily: 'monospace',
                  fontSize: '14px'
                }}>
                  <strong>Examples:</strong><br />
                  • "Doctor Edge brings up old dirt (6)" → DREDGE <br />
                  • "Mistake a New Testament as wayward (6)" → ERRANT<br />
                </div>
              </div>

              <div style={{ marginBottom: '25px' }}>
                <h4 style={{ fontSize: '16px', marginBottom: '8px', fontWeight: 'bold' }}>Double Definitions</h4>
                <p style={{ marginBottom: '10px' }}>Two different meanings of the same word</p>
                <div style={{
                  background: '#f8f9fa',
                  padding: '12px',
                  borderRadius: '6px',
                  border: '1px solid #dee2e6',
                  fontFamily: 'monospace',
                  fontSize: '14px'
                }}>
                  <strong>Examples:</strong><br />
                  • "Hunt and peck a preferred lover(4)" → TYPE<br />
                  • "An excited dog does this to your jeans(4)" → PANTS<br />
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '25px' }}>
              <h4 style={{ fontSize: '16px', marginBottom: '8px', fontWeight: 'bold' }}>Starts, Ends, and Middles</h4>
              <p style={{ marginBottom: '10px' }}>Referring to specific letters in words that otherwise don't have meaning (called fodder)</p>
              <div style={{
                background: '#f8f9fa',
                padding: '12px',
                borderRadius: '6px',
                border: '1px solid #dee2e6',
                fontFamily: 'monospace',
                fontSize: '14px'
              }}>
                <strong>Examples:</strong><br />
                • "Primarily snubs nosy others, taking to yelling "Obnoxious!" (6)" → SNOTTY<br />
                • "Horror with Fantasy Film matinee ends up to cup (5)" → RHYME<br />
                • "All too many hearts give money for promises (4)" → LOAN (the hearts of ALL TOO MANY are the middle letters, L, O, AN)<br />
            </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>3. Indicator Words</h3>
          <p style={{ marginBottom: '10px' }}>
            Cryptic clues use specific words to signal what type of wordplay is being used:
          </p>
          <ul style={{ marginBottom: '15px', paddingLeft: '20px' }}>
            <li><strong>Anagram indicators:</strong> broken, mixed, twisted, wild, crazy, etc.</li>
            <li><strong>Reversal indicators:</strong> back, returned, going west (left), upside down, etc.</li>
            <li><strong>Hidden word indicators:</strong> in, within, inside, part of, some, etc.</li>
            <li><strong>Homophone indicators:</strong> sounds, heard, spoken, audibly, etc.</li>
            <li><strong>Position Indicators:</strong> primarily, starts, ends, finishes, hearts, centers etc.</li>
          </ul>
        </div>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '15px' }}>Solving Tips</h2>
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>For Beginners</h3>
          <ul style={{ marginBottom: '15px', paddingLeft: '20px' }}>
            <li>Start with the shortest clues - they're often easier</li>
            <li>Look for anagram indicators first - they're usually the most obvious</li>
            <li>The definition is usually at the beginning or end of the clue</li>
            <li>Count the letters carefully - the number in parentheses shows the answer length</li>
            <li>Don't take anything literally - cryptic clues are full of misdirection</li>
          </ul>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>Advanced Techniques</h3>
          <ul style={{ marginBottom: '15px', paddingLeft: '20px' }}>
            <li>Learn common abbreviations used in cryptics (N=north, DR=doctor, etc.)</li>
            <li>Practice recognizing indicator words for different wordplay types</li>
            <li>Look for words that can have multiple meanings</li>
            <li>Consider the grammar - words might change form in the wordplay</li>
            <li>Use crossing letters to help confirm your answers</li>
            <li>If words stand out consider replacing them with common synonyms</li>
          </ul>
        </div>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '15px' }}>Example Walkthrough</h2>
        <div style={{
          background: '#f8f9fa',
          padding: '20px',
          borderRadius: '6px',
          border: '1px solid #dee2e6',
          marginBottom: '15px'
        }}>
          <strong>Clue:</strong> "Sounds like the North East passage! Let's move on! (6)"<br />
          <strong>Answer:</strong> ANYWAY
          <div style={{ marginTop: '10px', fontSize: '14px', color: '#6c757d' }}>
            <strong>Breakdown:</strong><br />
            • Definition: "Let's move on"<br />
            • Wordplay: "Sounds like" the north east becomes NE <br />
            • So instead of NE we have ANY <br />
            • Passage is replaced with way <br />
            • Combine we have ANYWAY, which means, Let's move on<br />
          </div>
        </div>
      </section>

      <section>
        <h2 style={{ fontSize: '24px', marginBottom: '15px' }}>Ready to Solve?</h2>
        <p style={{ marginBottom: '15px' }}>
          Now that you know the basics, head over to our puzzle pages and start practicing!
          Remember, cryptic crosswords take time to master, so don't get discouraged if they
          seem difficult at first. With practice, you'll start to recognize the patterns and
          enjoy the clever wordplay.
        </p>
        <p style={{ fontSize: '14px', color: '#6c757d', fontStyle: 'italic' }}>
          Happy solving!
        </p>
      </section>
    </div>
      </div >
    </div >
  );
};