export const aboutSections = [
  {
    index: '00',
    title: 'About Project',
    paragraphs: [
      'Race Trace MTB is an independent analytics project for UCI downhill racing. It combines race results, sector times, rider ratings, standings, comparisons, and performance trends in one place. Metrics such as Pace, Consistency, Rating, and Confidence help show not only where a rider finished, but how fast, repeatable, and reliable their performance was.',
      'The project is unofficial and is not affiliated with or endorsed by the UCI.',
    ],
  },
  {
    index: '01',
    title: 'Pace Parameter',
    paragraphs: [
      'Pace shows how fast a rider is compared with the rest of the field.',
      'The score is based mainly on sector times, gaps to the field, and position on each section of the track. Strong sectors and speed shown in the most important sessions—especially the final—have the greatest impact, while a dominant win can add a small bonus.',
      'The algorithm also considers route coverage and can distinguish a normally weak sector from a clear incident, such as a crash. Useful sectors after an incident may still count. Final position does not directly increase Pace—the score is driven primarily by actual speed.',
    ],
  },
  {
    index: '02',
    title: 'Consistency Parameter',
    paragraphs: [
      'Consistency shows how reliably a rider can repeat their performance across different runs and sessions.',
      'The score is driven mainly by incident frequency and how regularly the rider reaches the final. Repeated incidents and missed finals reduce Consistency progressively, while one isolated mistake has a limited effect. Direct Q1 qualification provides a small advantage over advancing through Q2.',
      'Position repeatability provides the remaining signal and is measured relative to field size. Finals carry most of its weight, so stable final results matter much more than variation in qualifying or seeding.',
    ],
  },
  {
    index: '03',
    title: 'Rating Parameter',
    paragraphs: [
      'Rating is the overall measure of a rider’s current performance level.',
      'It combines Pace, Consistency, and Result Score. Pace contributes 70% and reflects raw speed, while Consistency and finishing performance contribute 15% each. Result Score uses a progressive position curve that gives the largest separation near the top of the field.',
      'Competition class changes the relative impact of results when different classes are included together. The result rewards outright speed first, then adjusts it for sporting reliability and the ability to convert performance into strong finishes.',
    ],
  },
  {
    index: '04',
    title: 'Confidence Parameter',
    paragraphs: [
      'Confidence shows how reliable a rider’s Pace score is based on the amount and quality of available data.',
      'The score considers the number of valid sectors, track coverage, field size, and how many representative sessions the rider has completed. Finals provide stronger evidence than qualifying, while partial runs, incidents, and limited data reduce the result.',
      'Confidence does not measure speed or success and does not raise or lower Pace, Consistency, or Rating. A rider can have high Pace with low Confidence when the sample is small, while a slower rider can have high Confidence when many complete runs support the result.',
    ],
  },
  {
    index: '05',
    title: 'Development',
    paragraphs: [
      'Race Trace MTB is built and maintained by one developer responsible for the entire product—from collecting and structuring race data to designing the interface and developing the performance models.',
      'The project grew from a long-standing interest in downhill racing and a desire to turn complex timing information into something clear, useful, and enjoyable to explore.',
    ],
  },
] as const
