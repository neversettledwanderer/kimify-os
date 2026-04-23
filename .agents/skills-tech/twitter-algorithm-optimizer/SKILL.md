---
name: twitter-algorithm-optimizer
description: Analyze and optimize tweets for maximum reach using Twitter's open-source algorithm insights. Rewrite and edit user tweets to improve engagement and visibility based on how the recommendation system ranks content.
---

# Twitter / X Algorithm Optimizer

## When to Use This Skill

Use this skill when you need to:
- **Optimize tweet drafts** for maximum reach and engagement
- **Understand why** a tweet might not perform well algorithmically
- **Rewrite tweets** to align with the ranking mechanisms
- **Improve content strategy** based on the actual ranking algorithms
- **Debug underperforming content** and increase visibility
- **Maximize engagement signals** that the algorithms track

## What This Skill Does

1. **Analyzes tweets** against the core recommendation algorithms
2. **Identifies optimization opportunities** based on engagement signals
3. **Rewrites and edits tweets** to improve algorithmic ranking
4. **Explains the "why"** behind recommendations using algorithm insights
5. **Applies Real-graph, SimClusters, and TwHIN principles** to content strategy
6. **Provides engagement-boosting tactics** grounded in the actual systems

## How It Works: The Algorithm Architecture

The recommendation system uses multiple interconnected models:

### Core Ranking Models

**Real-graph**: Predicts interaction likelihood between users
- Determines if your followers will engage with your content
- Affects how widely content is shown to others
- Key signal: Will followers like, reply, or retweet this?

**SimClusters**: Community detection with sparse embeddings
- Identifies communities of users with similar interests
- Determines if your tweet resonates within specific communities
- Key strategy: Make content that appeals to tight communities who will engage

**TwHIN**: Knowledge graph embeddings for users and posts
- Maps relationships between users and content topics
- Helps understand if your tweet fits your follower interests
- Key strategy: Stay in your niche or clearly signal topic shifts

**Tweepcred**: User reputation/authority scoring
- Higher-credibility users get more distribution
- Your past engagement history affects current tweet reach
- Key strategy: Build reputation through consistent engagement

### Engagement Signals Tracked

**Explicit Signals** (high weight):
- Likes (direct positive signal)
- Replies (indicates valuable content worth discussing)
- Retweets (strongest signal - users want to share it)
- Quote tweets (engaged discussion)

**Implicit Signals** (also weighted):
- Profile visits (curiosity about the author)
- Clicks/link clicks (content deemed useful enough to explore)
- Time spent (users reading/considering your tweet)
- Saves/bookmarks (plan to return later)

**Negative Signals**:
- Block/report (penalized heavily)
- Mute/unfollow (person doesn't want your content)
- Skip/scroll past quickly (low engagement)

### The Feed Generation Process

Your tweet reaches users through this pipeline:

1. **Candidate Retrieval** - Multiple sources find candidate tweets:
   - Search Index (relevant keyword matches)
   - User Tweet & Reply (your own tweets)
   - User Follows (tweets from people you follow)
   - SimClusters (community-based recommendations)
   - TwHIN (embedding-based recommendations)
   - Trending tweets

2. **Heavy Ranking** - ML models score each candidate:
   - Real-graph predicts engagement likelihood
   - SimClusters scores community relevance
   - TwHIN evaluates content-topic fit
   - Tweepcred adjusts for author credibility

3. **Heuristic Filtering** - Removes low-quality content:
   - NSFW detection
   - Misinformation checks
   - Duplicate content filtering
   - Author reputation thresholds

4. **Mixing & Deduplication** - Final feed assembly:
   - Blends sources for variety
   - Removes duplicates
   - Ensures freshness vs. relevance balance

## How to Use

### Optimize a Single Tweet

```
Here's my draft tweet:

[ paste draft ]

Optimize this for maximum reach and engagement.
```

### Analyze Why a Tweet Underperformed

```
This tweet only got 50 impressions:

[ paste tweet ]

Why didn't this perform well? What should I change?
```

### Batch Optimize Multiple Tweets

```
Here are 5 tweet drafts for my thread:

1. [tweet 1]
2. [tweet 2]
...

Optimize all of them for the algorithm.
```

### Content Strategy Review

```
Review my last 10 tweets and tell me what patterns you see.
What should I do differently?
```

## Optimization Strategies

### 1. Hook Optimization

**Before**: "Just published a new blog post about marketing. Check it out!"
**After**: "I spent 6 months analyzing 1,000 marketing campaigns. Here's the 1 thing that separated winners from losers:"

**Why it works**:
- Creates curiosity gap (specific numbers + mystery)
- Implies valuable, unique insight
- Promises actionable takeaways
- Encourages click-through to replies/thread

### 2. Engagement Hooks

Add elements that trigger replies:
- **Polarizing takes** (within reason): "Unpopular opinion: [controversial but defensible stance]"
- **Questions**: "What's the biggest mistake you see [target audience] making?"
- **Fill-in-the-blank**: "The best [tool/platform] feature nobody talks about is ____."
- **Contrarian insights**: "Everyone says X. Here's why they're wrong:"

### 3. Thread Architecture

For maximum thread performance:
- **Hook tweet**: Must standalone (gets shown most)
- **First reply**: Deliver on hook's promise immediately
- **Middle tweets**: Deep value, examples, data
- **Final tweet**: Clear CTA + engagement ask

**Structure for algorithmic success**:
```
Tweet 1 (Hook): Shocking claim / Curiosity gap / Contrarian take
Tweet 2: Credibility establishment ("I've done X for Y years")
Tweet 3-6: Core insights with specific examples
Tweet 7: Common mistakes / What not to do
Tweet 8: Summary + clear CTA ("Follow for more" / "What did I miss?")
```

### 4. Timing and Consistency

- **Post when your audience is active** (use analytics to find peak times)
- **Consistency beats virality** — daily good tweets > weekly great tweets
- **Reply to replies quickly** — early engagement signals boost distribution
- **Quote tweet strategically** — adds your take to trending topics

### 5. Format Optimization

**Text-only tweets**:
- Keep under 280 characters when possible (easier to retweet with comment)
- Use line breaks for readability
- Lead with the most important word

**Media tweets**:
- Images get 2-3x engagement vs. text-only
- Videos under 45 seconds perform best
- Infographics and data visualizations drive saves/bookmarks

**Threads**:
- Number your tweets (1/8, 2/8) — encourages completion
- Each tweet should standalone (in case algorithm shows it in isolation)

### 6. Keyword and Topic Optimization

- Include relevant keywords naturally for Search Index retrieval
- Use 1-2 hashtags max (over-hashtagging looks spammy)
- Mention relevant accounts when appropriate (can trigger their Real-graph)
- Stay in your niche to build SimCluster relevance

### 7. Engagement Farming (Ethical)

Tactics that boost signals without being manipulative:
- **Ask for opinions**: "Which approach do you prefer? A or B?"
- **Share work-in-progress**: "Here's a preview of what I'm building. Thoughts?"
- **Behind-the-scenes**: Raw, authentic content builds Tweepcred
- **Teach something**: Educational content gets bookmarks and shares

## Anti-Patterns to Avoid

**Algorithmic penalties**:
- Copy-paste tweets (duplicate detection)
- Engagement bait ("Retweet if you agree!")
- Excessive external links (reduces time-on-platform)
- Posting and ghosting (not replying hurts Real-graph)
- Hashtag stuffing (>3 hashtags)
- Replying to viral tweets with off-topic promotions

**Performance killers**:
- Vague, generic statements
- Passive voice and weak verbs
- No clear value proposition
- Asking for engagement without providing value first
- Inconsistent posting (algorithm forgets you)

## Analysis Output Format

When analyzing a tweet, provide:

```markdown
# Tweet Analysis

## Original Tweet
[Original text]

## Algorithmic Score Estimate
- **Hook strength**: [Weak/Medium/Strong] — [why]
- **Engagement likelihood**: [Low/Medium/High] — [why]
- **Community fit**: [Poor/Good/Excellent] — [why]

## Identified Issues
1. [Issue] — [Algorithmic impact]
2. [Issue] — [Algorithmic impact]

## Optimized Version
[Improved tweet]

## Why This Works Better
- [Specific algorithmic reason]
- [Specific algorithmic reason]

## Alternative Versions
**Shorter**: [Condensed version]
**More provocative**: [Edgier version]
**More educational**: [Teaching-focused version]

## Recommended Next Steps
- [Action item]
- [Action item]
```

## Related Use Cases

- Building a content calendar optimized for engagement
- A/B testing different tweet formats
- Analyzing competitor accounts for content inspiration
- Creating tweet templates for different content types
- Developing a personal brand strategy on the platform
