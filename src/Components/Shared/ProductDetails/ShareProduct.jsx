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
        quote={`Check out this amazing product: ${product.name}!`}
      >
        <FacebookIcon size={30} round />
      </FacebookShareButton>
      <TwitterShareButton
        url={url}
        title={`Check out this amazing product: ${product.name}!`}
      >
        <TwitterIcon size={30} round />
      </TwitterShareButton>
      <TelegramShareButton
        url={url}
        title={`Check out this amazing product: ${product.name}!`}
      >
        <TelegramIcon size={30} round />
      </TelegramShareButton>
      <WhatsappShareButton
        url={url}
        title={`Check out this amazing product: ${product.name}!`}
        separator=" - "
      >
        <WhatsappIcon size={30} round />
      </WhatsappShareButton>
      <LinkedinShareButton
        url={url}
        title={`Check out this amazing product: ${product.name}!`}
        summary={product.description}
        source="Sam's Kitchen"
      >
        <LinkedinIcon size={30} round />
      </LinkedinShareButton>
    </div>
  );
};

export default ShareProduct;