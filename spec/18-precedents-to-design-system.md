# From prior work to Firdawsi's design practice

Research review: 18 October 2026. This document separates what the cited authors say, what was available to read, and Firdawsi's own design decisions. It is a working research synthesis, not a religious endorsement or a claim that the three works agree on a single design method.

## 1. Nasruddin and colleagues: cultural meaning has to survive use

### Evidence read

- [Nasruddin and Hussin, *Muslim Centred user interface design prototype* (2014)](https://ir.uitm.edu.my/id/eprint/70450/): the institutional record contains a one-page exposition abstract. It describes a Culture-Centred Design adaptation, a designer's cultural interpretation, a user's mental model, a product prototype, Islamic material including Qur'an and hadith, a mosque backdrop, icon metaphors, and student evaluation. It gives no detailed outcome measures.
- [Nasruddin et al., *Muslim Centered User Interface Design (MCUID) Framework and MCUID Prototype* (2022), pp. 170–180](https://www.istes.org/seeder/books/files/70a06283965f27a3f824dac257f774fc.pdf): a later, full conference paper from the same research line. It makes the three-part framework and one icon-recognition study inspectable.
- [Nasruddin and Hussin, *Users perception of Muslim centered interface design prototype* (2017)](https://irep.iium.edu.my/72855/): institutional book record. Its published PDF is restricted to repository staff, so this review does not infer findings from it.

### Extracted ideas and their limits

1. **Designer viewpoint:** the designer brings cultural knowledge, lived experience, religious understanding, usability knowledge, and assumptions into the work. In Firdawsi, these assumptions must be written down; a designer's confidence is not user evidence.
2. **User viewpoint:** the intended audience may interpret an image or metaphor differently from the designer. Firdawsi asks people to explain what a control will do before activating it, in their preferred language and input mode.
3. **Product interface:** the proposed metaphor has to work as a usable control. Its cultural resonance alone cannot establish discoverability, task success, or accessibility.
4. **Metaphor as a hypothesis:** the researchers used a mosque backdrop and devotional expressions as desktop metaphors. Firdawsi uses the research method, without making mosque imagery or devotional phrases generic product controls. The project keeps sacred material in explanatory contexts and gives actions plain functional labels.
5. **Recognition evidence:** the 2022 paper reports a closed card-sort exercise with 26 computer-literate students from two institutions. For the paper's reported “Bismillah” icon, 17 associated it with Start; 9 selected Off, My Computer, or Shut down. This is evidence of divergent interpretation within that sample, not a general population success rate or proof that the metaphor works across products.
6. **Ethical values mentioned in the paper:** unity, trusteeship, worship, knowledge, justice, public interest, goodness, beauty, and truth appear in its discussion of Islamic approaches to technology. Several are attributed there to earlier authors. They are broad ethical concepts in that paper, not nine tested UI rules. Firdawsi treats them as research prompts; any new scriptural mapping needs its own primary source, context, and design review.

### Design-system use

- For every culturally derived icon, pattern, name, or gesture, record **intended meaning**, **audience**, **expected action**, **alternative interpretations**, and **fallback label**.
- Validate action comprehension with people who differ in language, technical familiarity, and cultural background. Record both correct and unexpected interpretations. Do not ship an ambiguous icon as the only affordance.
- Keep a conventional, accessible control beneath any optional cultural treatment. Arabic and English tasks must both remain usable when the treatment is removed.

## 2. Riasat Islam: five process prompts

[Riasat Islam, *Design Thinking from an Islamic Perspective* (2024)](https://www.riasatislam.com/blog/design-thinking/) presents five headings. They are the author's interpretation of design thinking in relation to Islamic teaching. We use them as prompts for practice, while checking any Qur'anic or hadith connection independently.

1. **Empathy and compassion:** learn the circumstances, effort, and constraints of the people who will use the product. Design-system use: include failure, low connectivity, assistive technology, and Arabic reading as ordinary cases in a flow review. The article cites [21:107](https://quran.com/al-anbya/107), whose direct subject is the Prophet's mission; it is not a specification for interface tone.
2. **Purposeful ideation:** generate alternatives after identifying a real need. Design-system use: write the user need and likely harms before choosing a component or visual treatment. The article's general appeal to *ijtihad* is not a license to make independent religious rulings about UI.
3. **Prototyping and improvement:** build a small interaction, observe actual use, and revise it. Design-system use: retain evidence of what changed after review, rather than declaring “ihsan” or [2:195](https://quran.com/al-baqarah/195) a test pass. The verse's direct context concerns spending and doing good.
4. **Collaboration and consultation:** hear people affected by a design and people with relevant expertise. Design-system use: let Arabic readers, keyboard and screen-reader users, and domain experts review the same task. The consultation principle already has a bounded source-to-product mapping in [42:38](https://quran.com/ash-shuraa/38).
5. **Ethical responsibility:** consider foreseeable harm, exclusion, manipulation, privacy, and the wider effects of a feature. Design-system use: record a risk and mitigation for permission requests, pricing, data loss, and pressure tactics. The article cites [7:56](https://quran.com/al-araf/56), which addresses corruption on earth; a product harm review is a design application, not the verse's complete meaning.

The article also cites hadith and historical examples. This review does not adopt their authenticity, wording, or historical claims without independent source checks. Its five headings become Firdawsi process commitments, rather than five extra cards in the scripture-linked principle register.

## 3. Ardalan and Bakhtiar: coherence across scales

[Nader Ardalan and Laleh Bakhtiar, *The Sense of Unity: The Sufi Tradition in Persian Architecture* (University of Chicago Press, 1973)](https://books.google.com/books?id=oMDVV5JnbxkC) is a study of Persian architecture through a Sufi intellectual lens. The [publisher description](https://books.google.com/books/about/The_Sense_of_Unity.html?id=g7A3jwEACAAJ) identifies unity in multiplicity and relationships from an architectural unit to an urban environment. A [CEPT University library review, pp. 4–5](https://cept.ac.in/UserFiles/File/03%20CEPT%20University%202016/02%20-%20News/10%20-%20Oct/CEPT-bookrev-PRINT-1.pdf) describes three parts: a morphology of concepts (including space, shape, surface, colour, and matter); traditional forms (including garden, porch, gateway, room, and dome); and levels of realization (including synthesis, natural/geometric/harmonic order, city scale, and movement). This is a reviewer's summary, not direct access to the full book. No complete list of the authors' principles, diagrams, or prescriptions is claimed here.

Firdawsi's own compositional inferences from that bounded reading are:

1. **Parts and whole:** component, screen, and journey should share a legible hierarchy and related spacing logic. A repeated shape has a job only when it strengthens that relationship.
2. **Space before ornament:** spacing, alignment, grouping, and reading order should establish the composition before any pattern is considered.
3. **Scale with context:** a motif or visual treatment that works in a hero may fail inside a button, error, or dense form. Review each scale separately.
4. **Sequence of experience:** entry, orientation, task, recovery, and completion form a journey. This is Firdawsi's UI application, not a claim that the authors defined a software flow.
5. **Surface and material:** a background, frame, and focused content need distinct visual roles; contrast and readability govern their translation to screens. The CEPT review discusses surface, colour, and matter in architecture, while these specific UI roles are Firdawsi's invention.

These inferences are not a theology of interface geometry and do not make Persian architecture representative of all Muslim societies. Historic details remain under the provenance and regional-profile rules in this specification.

## How the research enters the design system

### Philosophy

- **Care is observed in use:** a well-intended screen can still confuse, exclude, or lose someone's work.
- **Meaning is tested with people:** cultural and religious resonance is a design hypothesis until intended users can identify the action and complete the task.
- **Consultation changes decisions:** record whose feedback changed a design and what was revised.
- **Coherence is relational:** proportion, typography, space, state, and motion should support a recognisable whole across scales.
- **Interpretation is bounded:** retain source context and distinguish revelation, an author's interpretation, and Firdawsi's design inference.

### Component and pattern contracts

- **Icon:** functional label and accessible name remain clear without imagery; test expected action and wrong interpretations. A sacred phrase is not a substitute for a control label.
- **Button and confirmation:** state the action and consequence. Check that decorative treatment does not hide the action or imply a religious mandate.
- **Field and long form:** preserve work, expose local repair, and include a pause/resume route where the task warrants it.
- **Permission prompt:** explain purpose and timing before access, then respect refusal and offer recovery where feasible.
- **Price or plan comparison:** show total cost, renewal terms, included benefits, and material limits before commitment.
- **Navigation:** keep stable landmarks and a clear current location across Arabic and English. Test the same journey in both directions.
- **Pattern and layout:** begin with an undecorated hierarchy, then add optional pattern only where it improves orientation or identity without reducing legibility.
- **Feedback:** report actual pending, success, and failure states. Observe whether people understand what happened.

### Required review record for an adopted feature

Record the user need; named audience and assumptions; source and original context when religious or cultural meaning is claimed; intended design inference; an ordinary functional fallback; observed comprehension and task outcome; feedback from affected users; change made after feedback; accessibility/language checks; and unresolved limitations. No numerical pass rate is invented from the MCUID student sample.

## Research gaps

- Read a legitimate full copy of *The Sense of Unity* before attributing additional architectural concepts to its authors.
- Obtain the restricted 2017 MCUID book through its repository's request process if detailed longitudinal findings are needed.
- Test Firdawsi's own metaphors, principle comprehension, Arabic/English copy, and complete workflows with intended audiences. Prior studies do not validate this product.
- Seek qualified review for public religious interpretations. A verified verse reference alone does not establish the validity of the UI analogy.
