// API endpoint for generating and publishing preseason power rankings
import { NextResponse } from 'next/server';
import { generateAccuratePreseasonPowerRankingsArticle } from '../../../../lib/accurate-preseason-power-rankings-generator.js';
import { generatePowerRankingsImage, savePowerRankingsImage } from '../../../../lib/power-rankings-image-generator.js';
import { addEnhancedArticle } from '../../../../lib/enhanced-storage.js';
import SleeperAPI from '../../../../lib/sleeper-api.js';

export async function POST(request) {
  try {
    // Check for admin secret
    const adminSecret = request.headers.get('x-admin-secret');
    if (adminSecret !== 'RABKLsecretkey_92h3jd83') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Generating preseason power rankings...');

    // Get teams data for image generation
    const teams = await SleeperAPI.getTeamsWithManagers();
    if (!teams || teams.length === 0) {
      return NextResponse.json({ error: 'No teams data available' }, { status: 500 });
    }

    // Generate the accurate article using Week 1 matchup data
    const article = await generateAccuratePreseasonPowerRankingsArticle();
    if (!article) {
      return NextResponse.json({ error: 'Failed to generate article' }, { status: 500 });
    }

    // Generate the power rankings image
    let imageData = null;
    try {
      imageData = await generatePowerRankingsImage(teams, 'RABKL Preseason Power Rankings');
      console.log('Generated power rankings image');
    } catch (error) {
      console.error('Error generating image:', error);
      // Continue without image
    }

    // Add image reference to article if generated
    if (imageData) {
      article.hero_image = '/images/rabkl-preseason-rankings-2025.svg';
      article.thumbnail = '/images/rabkl-preseason-rankings-thumb.svg';
    }

    // Publish the article
    const publishedArticles = await addEnhancedArticle(article);
    if (!publishedArticles) {
      return NextResponse.json({ error: 'Failed to publish article' }, { status: 500 });
    }

    console.log('Published preseason power rankings article');

    return NextResponse.json({
      success: true,
      message: 'Preseason power rankings generated and published',
      article: {
        id: article.id,
        title: article.title,
        category: article.category,
        timestamp: article.timestamp
      },
      image_generated: !!imageData,
      total_articles: publishedArticles.length
    });

  } catch (error) {
    console.error('Error in preseason power rankings endpoint:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Return information about the endpoint
    return NextResponse.json({
      endpoint: 'Preseason Power Rankings Generator',
      description: 'Generates comprehensive preseason power rankings with detailed analysis',
      method: 'POST',
      auth_required: true,
      features: [
        'Live Sleeper API data integration',
        'Detailed roster analysis and projections',
        'GM profile image integration',
        'Strength of schedule calculations',
        'Professional graphics generation',
        'Automatic article publishing'
      ]
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
