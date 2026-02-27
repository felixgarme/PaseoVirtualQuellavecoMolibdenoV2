window.addEventListener("load", function () {
    var checkPuzzles = setInterval(function () {
        if (
            typeof v3d !== "undefined" &&
            v3d.puzzles &&
            v3d.puzzles.procedures &&
            v3d.puzzles.procedures["cargado"]
        ) {
            clearInterval(checkPuzzles);

            var originalCargado = v3d.puzzles.procedures["cargado"];

            v3d.puzzles.procedures["cargado"] = function () {
                if (originalCargado) {
                    originalCargado.apply(this, arguments);
                }

                document.getElementById("loading-indicator").style.display = "none";
                document.getElementById("iniciar-btn").style.display = "flex";
            };
        }
    }, 250);

    document.getElementById("iniciar-btn").addEventListener("click", function () {
        if (typeof v3d !== "undefined" && v3d.puzzles && v3d.puzzles.procedures["inicio"]) {
            v3d.puzzles.procedures["inicio"]();
        } else {
            console.warn('La señal "inicio" no se encontró en los Puzzles.');
        }

        var loadingScreen = document.getElementById("loading-screen");
        loadingScreen.style.opacity = "0";
        setTimeout(function () {
            loadingScreen.style.display = "none";
        }, 500);
    });
});