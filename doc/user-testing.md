# User Testing

Notes on user testing and feedback gathering.

## Scenario

What do we tell a tester at the beginning of the session?

### Language Learner

You are a student looking for resources to learn to read and speak Cherokee.
You come across a website called "DAILP," whose goal is to support the ongoing creation of indigenous peoples’ knowledge, interpretations, and representations of the past by preserving and analyzing historical texts.

### Casual Visitor

Is it okay with you if I record this session for record keeping?

You are interested in American Indian language preservation and history, but not necessarily learning Cherokee.
You come across an organization called "DAILP" on the Northeastern University website and curiously take a look at their website.
The goal of DAILP is to support the ongoing creation of indigenous peoples’ knowledge, interpretations, and representations of the past by preserving and analyzing historical texts.
I am one of DAILP's developers and today I'd like to have you test the website and ask for your feedback.

## Features

Which features I hope to test here:

- Reading a Cherokee story
- Switch between different reading modes
- Matching up a word in the original image
- Finding other instances of a word in the document
- Look up a morpheme in the glossary

## Tasks

I'm going to read you a set of short tasks one at a time that I would like you to complete.
I will interfer minimally, so just keep trying unless you get really stuck.
This is not a test of you or your abilities, but rather a test of our interface.

Here is the link to the site: https://deploy-preview-76--dailp.netlify.app/

1. Find one Cherokee document that you are curious about.
2. Read through the translation.
3. Take a stab at pronouncing a Cherokee word that you see.
4. Figure out the root of another long word that you see.
5. Find the word you're looking at in the original image.

## Post-test Survey

1. What was your initial impression of the site?
   Did that change as you browsed?
2. Was any part of your experience confusing or frustrating?
3. Did you understand the document that you read?
4. Did any of my introduction or task descriptions feel misleading after using the interface?

## Overall Approach

The following is a sketch of how we could approaching stakeholder testing and collaboration.

1. Create multiple interface prototypes for different use cases. (see [Dow et al, 2010](https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=&ved=2ahUKEwi94P3PppHsAhWlUt8KHXkUA7oQFjABegQIBBAB&url=http%3A%2F%2Fspdow.ucsd.edu%2Ffiles%2FPrototypingParallel-TOCHI10.pdf&usg=AOvVaw3Y9g1TBANvYS0fiy9-50dH) for the value of parallel prototyping)
2. Present all prototypes together to stakeholders in each interest group: learners, experienced speakers, annotators, linguists, etc.
3. Let them play around themselves in the interface. Show and tell can only go so far, and letting stakeholders interact directly with our work will give us much more valuable discussion and feedback.
4. Ask them each questions about their experience, here are some examples:
   - "Would you use this?"
   - "Did one of these interfaces feel more intuitive or useful to you?"
   - "How could each interface be better?"
   - "Does this serve your needs as an X?"
   - "Does this respect your community and position in that community?"
5. Not only on their experience, but solicit feedback on how they themselves and tech-literate members of their community would feel most comfortable contributing to and participating in further development.
   Then we can change our process to facilitate that kind of involvement.
6. Iterate on all of the prototypes separately based on the feedback received.
7. Involve some of the same people and some new people in testing out these refined prototypes, to recognize where we've improved (or not) and where we stand in fresh eyes.
8. Consolidate these prototypes where possible while providing these same stakeholders with a link to our active working primary interface, and to our GitHub repository.
9. Solicit feedback on a single refined prototype that will become the production release candidate.
