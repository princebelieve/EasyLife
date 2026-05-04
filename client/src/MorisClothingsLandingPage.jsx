export default function MorisClothingsLandingPage() {
  const products = [
    {
      name: "Modern Sofa",
      price: "£450",
      image:
        "https://images.unsplash.com/photo-1617020042027-3f24c5771bee?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Oak Dining Table",
      price: "£620",
      image:
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Luxury Armchair",
      price: "£320",
      image:
        "https://images.unsplash.com/photo-1493666438817-866a91353ca9?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Minimalist Console",
      price: "£210",
      image:
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80",
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* HEADER */}
      <header className="border-b border-white/10 bg-neutral-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <h1 className="text-xl font-bold">NewBrend Furniture & Interior</h1>

          <div className="text-sm text-neutral-300">
            WhatsApp: +44 7440 092312
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="px-6 py-16 text-center">
        <h2 className="text-4xl font-bold md:text-5xl">
          Live Beautifully. Furnish with NewBrend.
        </h2>
        <p className="mt-4 text-neutral-300">
          Luxury furniture and interior styling for modern homes.
        </p>

        <a
          href="https://wa.me/447440092312"
          className="mt-6 inline-block rounded-xl bg-green-600 px-6 py-3 font-semibold"
        >
          Chat on WhatsApp
        </a>
      </section>

      {/* PRODUCTS */}
      <section className="mx-auto grid max-w-6xl gap-6 px-6 py-10 md:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <div
            key={product.name}
            className="overflow-hidden rounded-2xl border border-white/10 bg-white/5"
          >
            <img
              src={product.image}
              alt={product.name}
              className="h-72 w-full object-cover"
            />

            <div className="p-4">
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-neutral-300">{product.price}</p>

              <a
                href="https://wa.me/447440092312?text=I%20want%20to%20order%20a%20product"
                className="mt-3 block rounded-lg bg-green-600 px-4 py-2 text-center text-sm font-semibold"
              >
                Order via WhatsApp
              </a>

              <a
                href="https://buy.stripe.com/YOUR_STRIPE_PAYMENT_LINK"
                target="_blank"
                rel="noreferrer"
                className="mt-2 block rounded-lg border border-white/20 px-4 py-2 text-center text-sm"
              >
                Pay with Stripe
              </a>
            </div>
          </div>
        ))}
      </section>

      {/* CONTACT */}
      <section className="border-t border-white/10 px-6 py-10">
        <div className="mx-auto max-w-6xl">
          <h3 className="text-2xl font-bold">Contact</h3>

          <div className="mt-4 space-y-2 text-neutral-300">
            <p>WhatsApp: +44 7440 092312</p>
            <p>Email: moris.era@yahoo.com</p>
            <p>Instagram: Add your Instagram handle</p>
          </div>
        </div>
      </section>
    </div>
  );
}
