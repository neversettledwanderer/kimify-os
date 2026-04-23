---
name: lead-research-assistant
description: Identifies high-quality leads for your product or service by analyzing your business, searching for target companies, and providing actionable contact strategies. Perfect for sales, business development, and marketing professionals.
---

# Lead Research Assistant

This skill helps you identify and qualify potential leads for your business by analyzing your product/service, understanding your ideal customer profile, and providing actionable outreach strategies.

## When to Use This Skill

- Finding potential customers or clients for your product/service
- Building a list of companies to reach out to for partnerships
- Identifying target accounts for sales outreach
- Researching companies that match your ideal customer profile
- Preparing for business development activities

## What This Skill Does

1. **Understands Your Business**: Analyzes your product/service, value proposition, and target market
2. **Identifies Target Companies**: Finds companies that match your ideal customer profile based on:
   - Industry and sector
   - Company size and location
   - Technology stack and tools they use
   - Growth stage and funding
   - Pain points your product solves
3. **Prioritizes Leads**: Ranks companies based on fit score and relevance
4. **Provides Contact Strategies**: Suggests how to approach each lead with personalized messaging
5. **Enriches Data**: Gathers relevant information about decision-makers and company context

## How to Use

### Basic Usage

Simply describe your product/service and what you're looking for:

```
I'm building [product description]. Find me 10 companies in [location/industry] 
that would be good leads for this.
```

### With Your Codebase

For even better results, run this from your product's source code directory:

```
Look at what I'm building in this repository and identify the top 10 companies 
in [location/industry] that would benefit from this product.
```

### Advanced Usage

For more targeted research:

```
My product: [description]
Ideal customer profile:
- Industry: [industry]
- Company size: [size range]
- Location: [location]
- Current pain points: [pain points]
- Technologies they use: [tech stack]

Find me 20 qualified leads with contact strategies for each.
```

## Instructions

When a user requests lead research:

1. **Understand the Product/Service**
   - If in a code directory, analyze the codebase to understand the product
   - Ask clarifying questions about the value proposition
   - Identify key features and benefits
   - Understand what problems it solves

2. **Define Ideal Customer Profile**
   - Determine target industries and sectors
   - Identify company size ranges
   - Consider geographic preferences
   - Note technology stack indicators
   - Define decision-maker roles

3. **Research Target Companies**
   - Search for companies matching the ICP
   - Look for companies using complementary/competing tools
   - Identify companies with stated pain points
   - Consider recent funding, growth, or hiring as signals

4. **Qualify and Prioritize**

   Score each lead on:
   - **Fit**: How well they match the ICP (1-10)
   - **Timing**: Are they likely buying now? (1-10)
   - **Access**: Can you reach the right person? (1-10)
   - **Value**: Potential deal size (1-10)

5. **Provide Contact Strategy**

   For each top lead, suggest:
   - **Best channel**: Email, LinkedIn, warm intro, event
   - **Angle**: Referenced signal (funding, hiring, tech stack, etc.)
   - **Message hook**: Personalized opening line
   - **Value prop**: Specific benefit for their context
   - **CTA**: Clear next step

## Output Format

```markdown
# Lead Research: [Product/Service]

## Ideal Customer Profile
- **Industries**: [list]
- **Company Size**: [range]
- **Location**: [regions]
- **Tech Stack Signals**: [tools/platforms]
- **Pain Points**: [problems you solve]

## Top Leads

### 1. [Company Name] — Score: [X/40]
**Fit**: [score] | **Timing**: [score] | **Access**: [score] | **Value**: [score]

- **Industry**: [sector]
- **Size**: [employee count/revenue]
- **Location**: [city/country]
- **Why They're a Fit**: [specific reasoning]
- **Contact Strategy**:
  - **Channel**: [best approach]
  - **Angle**: [personalized hook]
  - **Message**: [draft outreach]

### 2. [Company Name] — Score: [X/40]
...

## Outreach Templates

### Template 1: Tech Stack Signal
[Draft email/LinkedIn message]

### Template 2: Growth Signal
[Draft email/LinkedIn message]

### Template 3: Pain Point Signal
[Draft email/LinkedIn message]
```

## Tips

- Start with 10-20 leads rather than 100 — quality over quantity
- Use web search to verify company details and find recent signals
- Check LinkedIn for mutual connections for warm intros
- Personalize every outreach — no batch spam
- Track responses to refine your ICP over time
- Focus on companies showing buying signals (hiring, funding, expansion)

## Related Use Cases

- Building a target account list for ABM campaigns
- Preparing for investor meetings with market research
- Finding partnership or integration opportunities
- Identifying speaking or sponsorship prospects
