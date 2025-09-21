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
              Cryptic crosswords are a type of word puzzle where each clue is a word puzzle in itself.
              Unlike standard crosswords that use straightforward definitions, cryptic clues contain
              both a definition and wordplay that leads to the answer.
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
                Example: "Worried about deer (6)" → SCARED<br/>
                <span style={{ fontSize: '14px', color: '#6c757d' }}>
                  Definition: "Worried" | Wordplay: "scare" (about) + "d" (deer)
                </span>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>2. Common Wordplay Types</h3>
              <ul style={{ marginBottom: '15px', paddingLeft: '20px' }}>
                <li><strong>Anagrams:</strong> Rearranging letters (indicated by words like "mixed", "confused", "broken")</li>
                <li><strong>Hidden Words:</strong> Answer hidden within the clue (indicated by "in", "within", "inside")</li>
                <li><strong>Reversals:</strong> Answer spelled backwards (indicated by "back", "returned", "reversed")</li>
                <li><strong>Homophones:</strong> Sounds like another word (indicated by "sounds", "heard", "spoken")</li>
                <li><strong>Abbreviations:</strong> Using common abbreviations or initials</li>
                <li><strong>Double Definitions:</strong> Two different meanings of the same word</li>
              </ul>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>3. Indicator Words</h3>
              <p style={{ marginBottom: '10px' }}>
                Cryptic clues use specific words to signal what type of wordplay is being used:
              </p>
              <ul style={{ marginBottom: '15px', paddingLeft: '20px' }}>
                <li><strong>Anagram indicators:</strong> broken, mixed, twisted, wild, crazy, etc.</li>
                <li><strong>Reversal indicators:</strong> back, returned, going west, upside down, etc.</li>
                <li><strong>Hidden word indicators:</strong> in, within, inside, part of, some, etc.</li>
                <li><strong>Homophone indicators:</strong> sounds, heard, spoken, audibly, etc.</li>
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
              <strong>Clue:</strong> "Fruit that's red mixed in with a dance (5)"<br/>
              <strong>Answer:</strong> MANGO
              <div style={{ marginTop: '10px', fontSize: '14px', color: '#6c757d' }}>
                <strong>Breakdown:</strong><br/>
                • Definition: "Fruit"<br/>
                • Wordplay: "red mixed" (anagram indicator) "in with a dance"<br/>
                • Take "red" and "mixed" suggests anagram<br/>
                • "in with a" = letters from "a" = A<br/>
                • "dance" = GO (as in "let's go dancing")<br/>
                • Anagram of "red" + A + GO = MANGO
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
      </div>
    </div>
  );
};