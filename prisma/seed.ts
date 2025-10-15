import { PrismaClient, AuthorityLevel, SourceStatus, Language, UserRole, Persona } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Create sample users
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@qadim.com' },
    update: {},
    create: {
      email: 'admin@qadim.com',
      name: 'Qadim Admin',
      role: UserRole.ADMIN,
      persona: Persona.NEUTRAL,
    },
  })

  const moderatorUser = await prisma.user.upsert({
    where: { email: 'moderator@qadim.com' },
    update: {},
    create: {
      email: 'moderator@qadim.com',
      name: 'Qadim Moderator',
      role: UserRole.MODERATOR,
      persona: Persona.NEUTRAL,
    },
  })

  const regularUser = await prisma.user.upsert({
    where: { email: 'user@qadim.com' },
    update: {},
    create: {
      email: 'user@qadim.com',
      name: 'Regular User',
      role: UserRole.USER,
      persona: Persona.ZAATAR,
    },
  })

  console.log('👥 Created users')

  // Create sample sources
  const sources = [
    {
      title: 'Official Lebanese Government Historical Records',
      publisher: 'Ministry of Culture - Lebanon',
      url: 'https://culture.gov.lb/archives',
      authority_level: AuthorityLevel.OFFICIAL,
      status: SourceStatus.VERIFIED,
      lang: Language.EN,
      year: 2023,
      credibility: 95,
      provenance: {
        author: 'Lebanese Ministry of Culture',
        published_at: '2023-01-15',
        sha256: 'abc123...',
        wayback_url: 'https://web.archive.org/web/20230115000000/https://culture.gov.lb/archives'
      }
    },
    {
      title: 'Phoenician Archaeological Discoveries in Tyre',
      publisher: 'American University of Beirut - Department of Archaeology',
      url: 'https://aub.edu.lb/fas/archaeology/publications',
      authority_level: AuthorityLevel.SCHOLARLY,
      status: SourceStatus.VERIFIED,
      lang: Language.EN,
      year: 2022,
      credibility: 92,
      provenance: {
        author: 'Dr. Hala Nasser',
        published_at: '2022-06-20',
        sha256: 'def456...',
        wayback_url: 'https://web.archive.org/web/20220620000000/https://aub.edu.lb/fas/archaeology/publications'
      }
    },
    {
      title: 'Lebanese Civil War: A Comprehensive Analysis',
      publisher: 'Journal of Middle Eastern Studies',
      authority_level: AuthorityLevel.SCHOLARLY,
      status: SourceStatus.VERIFIED,
      lang: Language.EN,
      year: 2021,
      credibility: 88,
      provenance: {
        author: 'Prof. Samir Khalaf',
        published_at: '2021-03-10',
        sha256: 'ghi789...'
      }
    },
    {
      title: 'Breaking: New Phoenician Artifacts Found in Sidon',
      publisher: 'The Daily Star Lebanon',
      url: 'https://dailystar.com.lb/archaeology-discovery',
      authority_level: AuthorityLevel.PRESS,
      status: SourceStatus.VERIFIED,
      lang: Language.EN,
      year: 2023,
      credibility: 75,
      provenance: {
        author: 'Sarah Johnson',
        published_at: '2023-09-15',
        sha256: 'jkl012...'
      }
    },
    {
      title: 'Community Oral History Project - Lebanese Diaspora',
      publisher: 'Lebanese Heritage Foundation',
      authority_level: AuthorityLevel.COMMUNITY,
      status: SourceStatus.UNVERIFIED,
      lang: Language.AR,
      year: 2023,
      credibility: 60,
      provenance: {
        author: 'Community Volunteers',
        published_at: '2023-11-01',
        sha256: 'mno345...'
      }
    },
    {
      title: 'Alternative Theory: Phoenicians and Atlantis Connection',
      publisher: 'Ancient Mysteries Blog',
      url: 'https://ancientmysteries.blog/phoenicians-atlantis',
      authority_level: AuthorityLevel.CLAIM,
      status: SourceStatus.CONTESTED,
      lang: Language.EN,
      year: 2023,
      credibility: 25,
      provenance: {
        author: 'Mystery Researcher',
        published_at: '2023-08-30',
        sha256: 'pqr678...'
      }
    }
  ]

  const createdSources = []
  for (const sourceData of sources) {
    const source = await prisma.source.upsert({
      where: { title: sourceData.title },
      update: {},
      create: sourceData,
    })
    createdSources.push(source)
  }

  console.log('📚 Created sources')

  // Create sample documents with embeddings
  const documents = [
    {
      source_id: createdSources[0].id, // Official source
      title: 'Lebanese Independence Declaration',
      content: `The Lebanese Declaration of Independence was proclaimed on November 22, 1943, marking the end of French colonial rule and the establishment of the modern Lebanese state. The declaration was signed by key Lebanese political leaders including Bechara El Khoury, Riad El Solh, and Camille Chamoun. This historic document established Lebanon as a parliamentary republic with a unique confessional system that allocated political representation among different religious communities. The declaration emphasized Lebanon's commitment to democracy, freedom, and national unity while maintaining its Arab identity and cultural heritage.`,
      lang: Language.EN,
      published_at: new Date('1943-11-22'),
    },
    {
      source_id: createdSources[1].id, // Scholarly source
      title: 'Phoenician Maritime Technology and Navigation',
      content: `The Phoenicians were master navigators and shipbuilders whose maritime innovations revolutionized ancient trade and exploration. Their ships featured advanced hull designs, multiple masts, and sophisticated rigging systems that enabled long-distance voyages across the Mediterranean and beyond. Archaeological evidence from Phoenician shipwrecks reveals their use of cedar wood from Lebanon, precise joint construction techniques, and watertight compartments. The Phoenicians established trading posts throughout the Mediterranean, including Carthage in North Africa, Cadiz in Spain, and settlements in Sicily and Sardinia. Their navigation techniques included celestial observation, coastal landmarks, and the use of sounding weights to measure water depth.`,
      lang: Language.EN,
      published_at: new Date('2022-06-20'),
    },
    {
      source_id: createdSources[2].id, // Scholarly source
      title: 'Roots of the Lebanese Civil War (1975-1990)',
      content: `The Lebanese Civil War was a complex conflict that emerged from deep-seated political, religious, and social tensions within Lebanese society. The war began on April 13, 1975, with clashes between Christian Phalangist militias and Palestinian factions in Beirut. Underlying causes included the presence of Palestinian refugees and armed groups, sectarian imbalances in the political system, regional tensions between Syria and Israel, and economic disparities. The conflict involved multiple factions including Christian militias, Muslim groups, Palestinian organizations, Syrian forces, and Israeli interventions. The war resulted in approximately 120,000 deaths, massive displacement, and the destruction of infrastructure. The Taif Agreement of 1989 eventually led to the war's conclusion, establishing a new power-sharing arrangement between Lebanon's religious communities.`,
      lang: Language.EN,
      published_at: new Date('2021-03-10'),
    },
    {
      source_id: createdSources[3].id, // Press source
      title: 'Archaeological Discovery in Sidon Reveals Phoenician Trade Networks',
      content: `Archaeologists working in the ancient Phoenician city of Sidon have uncovered a remarkable collection of artifacts that sheds new light on Phoenician trade networks and cultural exchange. The discovery includes ceramic vessels from Cyprus, jewelry from Egypt, and metalwork from Anatolia, demonstrating the extensive reach of Phoenician commercial activities. Dr. Hala Nasser, lead archaeologist from the American University of Beirut, noted that the artifacts date back to the 8th century BCE and provide evidence of sophisticated trading relationships across the Mediterranean. The site also revealed evidence of Phoenician purple dye production, a highly valued commodity in the ancient world. The excavation is part of a larger effort to preserve and study Lebanon's Phoenician heritage.`,
      lang: Language.EN,
      published_at: new Date('2023-09-15'),
    },
    {
      source_id: createdSources[4].id, // Community source
      title: 'Oral Histories from Lebanese Emigrants',
      content: `This collection of oral histories documents the experiences of Lebanese emigrants who left Lebanon during various periods of conflict and economic hardship. The stories capture the challenges of maintaining cultural identity while adapting to new countries, the importance of family networks in emigration, and the continued connection to Lebanon despite physical distance. Many interviewees describe the role of Lebanese cuisine, music, and religious traditions in preserving their heritage. The project includes testimonies from emigrants who settled in the Americas, Europe, Africa, and Australia, representing different waves of Lebanese emigration from the late 19th century to the present. These personal narratives provide valuable insights into the Lebanese diaspora experience and its impact on both host countries and Lebanon itself.`,
      lang: Language.AR,
      published_at: new Date('2023-11-01'),
    },
    {
      source_id: createdSources[5].id, // Claim source
      title: 'Phoenicians and the Lost City of Atlantis',
      content: `Recent discoveries suggest that the Phoenicians may have had contact with the legendary lost city of Atlantis. Ancient Phoenician texts discovered in a private collection describe encounters with an advanced civilization that possessed technology far beyond that of other ancient cultures. The texts mention cities built with unusual materials that could not be identified by Phoenician scholars of the time. Some researchers believe that the Phoenicians' advanced navigation skills and extensive trade networks may have led them to discover remnants of the Atlantean civilization. However, mainstream archaeologists remain skeptical of these claims, noting the lack of verifiable evidence and the speculative nature of the interpretations. The debate continues among alternative history researchers who argue that conventional archaeology may be overlooking important clues about ancient advanced civilizations.`,
      lang: Language.EN,
      published_at: new Date('2023-08-30'),
    }
  ]

  for (const docData of documents) {
    // Generate a mock embedding (in production, this would be generated by OpenAI)
    const mockEmbedding = Array.from({ length: 1536 }, () => Math.random() - 0.5)
    
    await prisma.doc.upsert({
      where: { 
        title_source_id: {
          title: docData.title,
          source_id: docData.source_id
        }
      },
      update: {},
      create: {
        ...docData,
        embedding: mockEmbedding as any, // Cast to handle pgvector type
      },
    })
  }

  console.log('📄 Created documents')

  // Create sample questions and answers
  const sampleQuestion = await prisma.question.create({
    data: {
      text: 'What was the Phoenician alphabet and how did it influence other writing systems?',
      lang: Language.EN,
      user_id: regularUser.id,
    },
  })

  const sampleAnswer = await prisma.answer.create({
    data: {
      question_id: sampleQuestion.id,
      summary: `The Phoenician alphabet was one of the first alphabetic writing systems, developed around 1200 BCE by the Phoenician civilization. Unlike earlier writing systems that used hundreds of symbols, the Phoenician alphabet used only 22 letters, each representing a consonant sound. This innovation made writing much more accessible and efficient.

The Phoenician alphabet had a profound influence on other writing systems. The Greeks adapted it around 800 BCE, adding vowels to create the Greek alphabet. The Greek alphabet, in turn, became the foundation for the Latin alphabet used in English and many other languages today. The Phoenician alphabet also influenced the Hebrew, Arabic, and Aramaic scripts.

The Phoenicians' extensive trade networks helped spread their writing system throughout the Mediterranean world. Archaeological evidence shows Phoenician inscriptions found from Lebanon to Spain, demonstrating the alphabet's wide reach and influence on ancient civilizations.`,
      citations: [
        {
          source_id: createdSources[1].id,
          snippet: 'The Phoenicians were master navigators and shipbuilders whose maritime innovations revolutionized ancient trade...',
          authority_level: 'SCHOLARLY',
          status: 'VERIFIED',
          score: 0.95
        },
        {
          source_id: createdSources[0].id,
          snippet: 'Official Lebanese Government Historical Records contain extensive documentation...',
          authority_level: 'OFFICIAL',
          status: 'VERIFIED',
          score: 0.92
        }
      ],
      confidence: 89,
      controversy: 15,
      persona: Persona.NEUTRAL,
    },
  })

  console.log('❓ Created sample Q&A')

  // Create sample community notes
  const communityNote = await prisma.communityNote.create({
    data: {
      user_id: moderatorUser.id,
      target_answer_id: sampleAnswer.id,
      note: 'This answer could benefit from mentioning the specific Phoenician cities where the alphabet was developed, such as Byblos, Tyre, and Sidon. These locations are significant for understanding the alphabet\'s origins.',
      citations: [
        {
          source_id: createdSources[1].id,
          snippet: 'Archaeological evidence from Phoenician shipwrecks reveals their use of cedar wood from Lebanon...',
          authority_level: 'SCHOLARLY',
          status: 'VERIFIED',
          score: 0.88
        }
      ],
      status: 'APPROVED',
    },
  })

  console.log('📝 Created community notes')

  console.log('✅ Seed completed successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
