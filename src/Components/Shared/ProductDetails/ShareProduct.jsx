import {
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";

const ShareProduct = ({ product }) => {
  const url = `${window.location.origin}/products/${product._id}`;

  return (
    <div className="flex gap-2 items-center">
      <FacebookShareButton
        url={url}
        quote={`Check out this amazing product: ${product.name}! on ShopSphere`}
      >
        <FacebookIcon size={33} round />
      </FacebookShareButton>
      <TwitterShareButton
        url={url}
        title={`Check out this amazing product: ${product.name}! on ShopSphere`}
      >
        <TwitterIcon size={33} round />
      </TwitterShareButton>
      <TelegramShareButton
        url={url}
        title={`Check out this amazing product: ${product.name}! on ShopSphere`}
      >
        <TelegramIcon size={33} round />
      </TelegramShareButton>
      <WhatsappShareButton
        url={url}
        title={`Check out this amazing product: ${product.name}! on ShopSphere`}
        separator=" - "
      >
        <WhatsappIcon size={33} round />
      </WhatsappShareButton>
      <LinkedinShareButton
        url={url}
        title={`Check out this amazing product: ${product.name}! on ShopSphere`}
        summary={product.description}
        source="ShopSphere"
      >
        <LinkedinIcon size={33} round />
      </LinkedinShareButton>
    </div>
  );
};

export default ShareProduct;