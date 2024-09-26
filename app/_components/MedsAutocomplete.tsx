"use client";
import { FilledInput } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import Head from "next/head";
import Link from "next/link";
import Button from "@mui/material/Button";

export default function MedsAutocomplete() {
	const rxtermsRef = useRef<HTMLInputElement & { autocomp?: any }>(null);
	const strengthsRef = useRef<HTMLInputElement & { autocomp?: any }>(null);

	useEffect(() => {
		if (
			typeof window !== "undefined" &&
			rxtermsRef.current &&
			strengthsRef.current
		) {
			// Initialize the drug name autocompleter (AJAX search)
			new (window as any).Def.Autocompleter.Search(
				rxtermsRef.current,
				"https://clinicaltables.nlm.nih.gov/api/rxterms/v3/search?ef=STRENGTHS_AND_FORMS,RXCUIS"
			);

			// Initialize an empty list for the strength field (prefetch)
			new (window as any).Def.Autocompleter.Prefetch(strengthsRef.current, []);

			// Observe drug name selection to populate strength and RxCUI
			(window as any).Def.Autocompleter.Event.observeListSelections(
				"rxterms",
				function () {
					const drugField = rxtermsRef.current;
					if (drugField && drugField.autocomp) {
						const drugName = drugField.value;
						const drugAutocomp = drugField.autocomp;
						const strengths =
							drugAutocomp.getItemExtraData(drugName)["STRENGTHS_AND_FORMS"];

						if (strengths && strengthsRef.current) {
							strengthsRef.current.autocomp.setListAndField(strengths);
						}
					}
				}
			);
		}
	}, []);

	type Medication = {
		name: string;
		dose: string;
	};

	const [medicationsList, setMedicationsList] = useState([] as Medication[]);
	const [medication, setMedication] = useState("");
	const [dose, setDose] = useState("");

	function addMedication() {
		setMedicationsList([...medicationsList, { name: medication, dose: dose }]);
		setMedication("");
		setDose("");
	}

	return (
		<div className="min-w-full h-screen flex flex-col items-center justify-around">
			<Head>
				<Link
					href="https://lhcforms-static.nlm.nih.gov/autocomplete-lhc-versions/17.0.3/autocomplete-lhc.min.css"
					rel="stylesheet"
				/>
			</Head>
			<Script
				src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"
				strategy="beforeInteractive"
			/>
			<Script
				src="https://lhcforms-static.nlm.nih.gov/autocomplete-lhc-versions/17.0.3/autocomplete-lhc.min.js"
				strategy="beforeInteractive"
			/>
			<div>
				<h2>Medications Added by Educator</h2>
				<ul>
					{medicationsList.map((medication, index) => (
						<li key={index}>
							{medication.name} - {medication.dose}
						</li>
					))}
				</ul>
			</div>
			<div className="flex justify-center items-end gap-3">
				{/* <FormControl>
					<InputLabel htmlFor="meds-search">Medication</InputLabel>
					<FilledInput
						id="meds-search"
						placeholder="Search medications"
						ref={rxtermsRef}
						fullWidth
					/>
				</FormControl>
				<FormControl>
					<InputLabel htmlFor="dose-list">Dose</InputLabel>
					<FilledInput id="dose-list" ref={strengthsRef} fullWidth />
				</FormControl> */}
				<div className="flex flex-col">
					<label>Medication</label>
					<input
						ref={rxtermsRef}
						type="text"
						id="rxterms"
						placeholder="Search medications"
						className="border-2 border-slate-300 rounded indent-1"
						// value={medication}
						// onChange={(e) => setMedication(e.target.value)}
						// onBlur={(e) => setMedication(e.target.value)}
					/>
				</div>
				<div className="flex flex-col">
					<label>Dose</label>
					<input
						ref={strengthsRef}
						type="text"
						id="drug_strengths"
						className="border-2 border-slate-300 rounded indent-1"
						placeholder="Select a dose"
						// value={dose}
						// onChange={(e) => setDose(e.target.value)}
					/>
				</div>
				{/* when the button is clicked, add a medication object to the medicationsList state */}
				<Button variant="contained" size="small" onClick={addMedication}>
					Add medication
				</Button>
			</div>
		</div>
	);
}
