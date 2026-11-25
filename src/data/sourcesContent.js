// Text for the Sources section. Each page: pill title, where Back goes, and sections of paragraphs.
export const PAGES = {
  cardio: {
    pill: 'Cardio', back: '/sources/health',
    sections: [{
      heading: 'The Science Behind Cardiovascular Exercise',
      paragraphs: [
        'Cardiovascular exercise increases heart rate and oxygen consumption, strengthening the heart muscle and improving circulation and overall cardiorespiratory efficiency.',
        "Regular cardio improves the body's ability to transport and utilize oxygen by increasing cardiovascular and respiratory efficiency. It also enhances mitochondrial function and endurance, allowing muscles to produce energy more effectively during physical activity.",
      ],
    }],
  },
  fitness: {
    pill: 'Fitness', back: '/sources/health',
    sections: [{
      heading: 'The Science Behind Physical Fitness',
      paragraphs: [
        'Fitness improves overall physical health by increasing muscular strength, endurance, flexibility, and cardiovascular efficiency. Regular physical activity helps maintain a healthy metabolism and strengthens bones and joints. It also improves energy levels, supports mental well-being, and reduces the risk of chronic diseases.',
      ],
    }],
  },
  evidence: {
    pill: 'Evidence & Limitations', back: '/sources',
    sections: [
      { heading: 'Evidence', paragraphs: [
        'The information in this app is supported by scientific research and studies about physical fitness, cardiovascular health, and exercise. Reliable sources such as medical journals, universities, and health organizations help ensure the information is accurate.',
      ] },
      { heading: 'Limitations', paragraphs: [
        "However, fitness results may vary depending on a person's age, health, lifestyle, and physical ability. This app provides educational information and should not replace professional medical advice.",
      ] },
    ],
  },
  article: {
    pill: 'Article', back: '/sources/references', backLabel: 'Back',
    sections: [{
      heading: 'The Science Behind Physical Fitness',
      paragraphs: [
        'Physical fitness plays an essential role in maintaining overall health by improving cardiovascular function, muscular strength, and metabolic efficiency. Research suggests that consistent physical activity enhances oxygen delivery to muscles, strengthens the cardiovascular system, and reduces the risk of chronic diseases. Incorporating regular exercise into daily routines can improve physical performance, increase energy levels, and support long-term health.',
      ],
    }],
  },
  reliability: {
    pill: 'Reliability Summary', back: '/sources',
    sections: [{
      heading: 'The Science Behind Physical Fitness – 7 / 10',
      paragraphs: [
        'The article provides scientifically supported information about physical fitness and its health benefits. However, its reliability could be improved by including more research studies, scientific evidence, and verified academic references. Overall, the information is useful and informative, but additional sources would strengthen its credibility.',
      ],
    }],
  },
}

// Sources & References page text (the made-up reference)
export const REFERENCE = {
  source: 'University of Michigan – Department of Exercise Science. Research on the benefits of physical fitness and regular exercise by Professor Xavier (2024).',
  apa: 'Xavier, P. (2024). The importance of physical fitness and cardiovascular health. University of Michigan, Department of Exercise Science.',
  note: 'This is a made-up reference for example purposes, not a real University of Michigan publication.',
}
