        />

        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-[2px] focus:bg-accent focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:text-void"
        >
          Skip to content
        </a>

        <ScrollSync />
        <Navbar />
        <main id="main" tabIndex={-1} className="relative z-10 outline-none">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
