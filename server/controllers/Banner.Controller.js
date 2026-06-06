import BannerModel from '../models/Banner.model.js';

// Get all active banners (for users)
export const getAllBanners = async (req, res) => {
  try {
    const banners = await BannerModel.find({ active: true }).sort({ order: 1, createdAt: -1 });
    res.status(200).json(banners);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching banners', error: error.message });
  }
};

// Get all banners including inactive (for admin)
export const getAllBannersAdmin = async (req, res) => {
  try {
    const banners = await BannerModel.find().sort({ order: 1, createdAt: -1 });
    res.status(200).json(banners);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching banners', error: error.message });
  }
};

// Create a new banner
export const createBanner = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Banner image is required' });
    }
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const imageUrl = `${baseUrl}/images/${req.file.filename}`;
    const { title, subtitle, order } = req.body;

    const banner = new BannerModel({
      image: imageUrl,
      title: title || '',
      subtitle: subtitle || '',
      order: order ? parseInt(order) : 0,
      active: true,
    });

    await banner.save();
    res.status(201).json(banner);
  } catch (error) {
    console.error('Error creating banner:', error);
    res.status(500).json({ message: 'Error creating banner', error: error.message });
  }
};

// Toggle banner active/inactive
export const toggleBanner = async (req, res) => {
  try {
    const banner = await BannerModel.findById(req.params.id);
    if (!banner) return res.status(404).json({ message: 'Banner not found' });
    banner.active = !banner.active;
    await banner.save();
    res.status(200).json(banner);
  } catch (error) {
    res.status(500).json({ message: 'Error toggling banner', error: error.message });
  }
};

// Delete a banner
export const deleteBanner = async (req, res) => {
  try {
    const banner = await BannerModel.findByIdAndDelete(req.params.id);
    if (!banner) return res.status(404).json({ message: 'Banner not found' });
    res.status(200).json({ message: 'Banner deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting banner', error: error.message });
  }
};
