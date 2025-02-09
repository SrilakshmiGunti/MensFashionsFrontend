import { useToast } from "@/components/ui/use-toast"; // Use the existing useToast hook
import { brandOptionsMap, categoryOptionsMap } from "@/config";
import { IndianRupee } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";

function ShoppingProductTile({
  product,
  handleGetProductDetails,
  handleAddtoCart,
}) {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAddToCartClick = async (productId, totalStock) => {
    try {
      const data = await handleAddtoCart(productId, totalStock);
      if (data?.payload?.success) {
        toast({
          title: "Product Added",
          description: "Your product has been added to the cart.",
          status: "success",
          duration: 3000, // Show the toast for 3 seconds
          isClosable: true,
          toastId: `success-${productId}`, // Unique toastId for success
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to add product to the cart.",
          status: "error",
          duration: 3000, // Show the toast for 3 seconds
          isClosable: true,
          toastId: `error-${productId}`, // Unique toastId for error
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        status: "error",
        duration: 3000, // Show the toast for 3 seconds
        isClosable: true,
        toastId: `error-${productId}`, // Unique toastId for error
      });
    }
  };

  return (
    <Card className="w-full max-w-sm mx-auto">
      <div onClick={() => handleGetProductDetails(product?._id)}>
        <div className="relative">
          <img
            src={product?.image}
            alt={product?.title}
            className="w-full h-[300px] object-cover rounded-t-lg"
          />
          {product?.totalStock === 0 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              Out Of Stock
            </Badge>
          ) : product?.totalStock < 10 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              {`Only ${product?.totalStock} items left`}
            </Badge>
          ) : product?.salePrice > 0 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              Sale
            </Badge>
          ) : null}
        </div>
        <CardContent className="p-4">
          <h2 className="text-xl font-bold mb-2">{product?.title}</h2>
          <div className="flex justify-between items-center mb-2">
            <span className="text-[16px] text-muted-foreground">
              {categoryOptionsMap[product?.category]}
            </span>
            <span className="text-[16px] text-muted-foreground">
              {brandOptionsMap[product?.brand]}
            </span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span
              className={`${
                product?.salePrice > 0 ? "line-through" : ""
              } text-lg font-semibold text-primary flex items-center gap-1`}
            >
              <IndianRupee size={15} />
              {product?.price}
            </span>

            {product?.salePrice > 0 ? (
              <span className="text-lg font-semibold text-primary flex items-center gap-1">
                <IndianRupee size={15} />
                {product?.salePrice}
              </span>
            ) : null}
          </div>
        </CardContent>
      </div>
      <CardFooter>
        {product?.totalStock === 0 ? (
          <Button className="w-full opacity-60 cursor-not-allowed">
            Out Of Stock
          </Button>
        ) : (
          <Button
            onClick={() => handleAddToCartClick(product?._id, product?.totalStock)}
            className="w-full"
          >
            Add to cart
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default ShoppingProductTile;